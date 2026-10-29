import { access, rename, rm, cp } from "node:fs/promises";
import { resolve } from "node:path";

export const ASAR_UNPACK_NATIVE_GLOB = "*.{node,dll,dylib,exe}";

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export function createAppAsarPackArgs({ sourceDir, destinationPath, targetPlatformKey }) {
  return [
    "pack",
    sourceDir,
    destinationPath,
    "--unpack",
    ASAR_UNPACK_NATIVE_GLOB,
    "--unpack-dir",
    `node_modules/node-pty/prebuilds/${targetPlatformKey}`,
  ];
}

export async function replaceAppAsarFromStaging({
  sourceDir,
  appAsarPath,
  targetPlatformKey,
  runAsarCommand,
}) {
  const candidateAsarPath = `${appAsarPath}.next`;
  const candidateUnpackedPath = `${candidateAsarPath}.unpacked`;
  const unpackedPath = `${appAsarPath}.unpacked`;
  const originalUnpackedPath = `${appAsarPath}.unpacked`;

  console.log(`[asar-repack] sourceDir: ${sourceDir}`);
  console.log(`[asar-repack] appAsarPath: ${appAsarPath}`);
  console.log(`[asar-repack] targetPlatformKey: ${targetPlatformKey}`);
  console.log(`[asar-repack] candidateAsarPath: ${candidateAsarPath}`);
  console.log(`[asar-repack] candidateUnpackedPath: ${candidateUnpackedPath}`);
  console.log(`[asar-repack] unpackedPath: ${unpackedPath}`);
  console.log(`[asar-repack] originalUnpackedPath: ${originalUnpackedPath}`);

  await Promise.all([
    rm(candidateAsarPath, { force: true, recursive: true }),
    rm(candidateUnpackedPath, { force: true, recursive: true }),
  ]);

  // The original .unpacked directory only exists if the original asar was created with --unpack-dir.
  // If it doesn't exist, we don't need to copy it - the new asar will be created without an unpacked dir.
  // The --unpack-dir option in the pack command will create the unpacked dir from the sourceDir's .unpacked
  // if it exists. So we only copy if it exists.
  if (await pathExists(originalUnpackedPath)) {
    console.log(`[asar-repack] Copying original .unpacked from ${originalUnpackedPath} to ${sourceDir}`);
    await cp(originalUnpackedPath, resolve(sourceDir, '.unpacked'), { recursive: true });
  } else {
    console.log(`[asar-repack] INFO: original .unpacked not found at ${originalUnpackedPath}, skipping copy`);
  }

  try {
    const packArgs = createAppAsarPackArgs({
      sourceDir,
      destinationPath: candidateAsarPath,
      targetPlatformKey,
    });
    console.log(`[asar-repack] pack args:`, packArgs);

    runAsarCommand(packArgs);

    console.log(`[asar-repack] Checking candidateAsarPath: ${candidateAsarPath}`);
    console.log(`[asar-repack] Checking candidateUnpackedPath: ${candidateUnpackedPath}`);

    if (!(await pathExists(candidateAsarPath)) || !(await pathExists(candidateUnpackedPath))) {
      // CI 的 TMPDIR 位于隐藏目录 `.tmp`。旧 glob 含 `**/`，@electron/asar 用绝对路径
      // 匹配时不会跨过隐藏目录，导致 native 被写回 asar，同时遗留旧 unpacked 形成物理双份。
      console.error(`[asar-repack] FAILED: candidateAsarPath exists: ${await pathExists(candidateAsarPath)}, candidateUnpackedPath exists: ${await pathExists(candidateUnpackedPath)}`);
      throw new Error(`重打包结果缺少 app.asar 或 app.asar.unpacked: ${candidateAsarPath}`);
    }

    // 先完整生成候选文件，再替换旧 archive 和 sidecar；不会把上一次打包的跨平台 native 留在 unpacked。
    await rm(unpackedPath, { force: true, recursive: true });
    await rename(candidateUnpackedPath, unpackedPath);
    await rm(appAsarPath, { force: true });
    await rename(candidateAsarPath, appAsarPath);
  } finally {
    await Promise.all([
      rm(candidateAsarPath, { force: true, recursive: true }),
      rm(candidateUnpackedPath, { force: true, recursive: true }),
    ]);
  }
}
