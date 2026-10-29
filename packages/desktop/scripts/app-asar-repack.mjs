import { access, rename, rm, cp, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { createRequire } from "node:module";

export const ASAR_UNPACK_NATIVE_GLOB = "*.{node,dll,dylib,exe}";

const require = createRequire(import.meta.url);

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function ensureNodePtyPrebuildsInStaging({ sourceDir, targetPlatformKey, appAsarPath }) {
  const targetDir = resolve(sourceDir, "node_modules", "node-pty", "prebuilds", targetPlatformKey);
  console.log(`[asar-repack] Checking for node-pty prebuilds at: ${targetDir}`);
  if (await pathExists(targetDir)) {
    console.log(`[asar-repack] node-pty prebuilds already present at ${targetDir}`);
    return;
  }

  console.log(`[asar-repack] node-pty prebuilds not found at ${targetDir}, attempting to copy from source package`);

  // Try to locate the node-pty package in the current node_modules tree
  let nodePtyPackageRoot;
  try {
    const packageJsonPath = require.resolve("node-pty/package.json");
    nodePtyPackageRoot = dirname(packageJsonPath);
    console.log(`[asar-repack] Found node-pty at: ${nodePtyPackageRoot}`);
  } catch {
    console.warn(`[asar-repack] WARNING: Could not resolve node-pty package.json`);
    // Try to extract from the original asar as a fallback
    await extractNodePtyFromAsar({ appAsarPath, targetPlatformKey, sourceDir });
    return;
  }

  const sourcePrebuildDir = resolve(nodePtyPackageRoot, "prebuilds", targetPlatformKey);
  console.log(`[asar-repack] Looking for source prebuilds at: ${sourcePrebuildDir}`);
  if (!(await pathExists(sourcePrebuildDir))) {
    console.warn(`[asar-repack] WARNING: Source prebuild directory not found: ${sourcePrebuildDir}`);
    // Try to extract from the original asar as a fallback
    await extractNodePtyFromAsar({ appAsarPath, targetPlatformKey, sourceDir });
    return;
  }

  console.log(`[asar-repack] Copying node-pty prebuilds from ${sourcePrebuildDir} to ${targetDir}`);
  await mkdir(targetDir, { recursive: true });
  await cp(sourcePrebuildDir, targetDir, { recursive: true });
  console.log(`[asar-repack] Copied node-pty prebuilds successfully`);
}

async function extractNodePtyFromAsar({ appAsarPath, targetPlatformKey, sourceDir }) {
  console.log(`[asar-repack] Attempting to extract node-pty prebuilds from original asar`);
  const platformSpecificDir = `node_modules/node-pty/prebuilds/${targetPlatformKey}`;
  const tempExtractDir = `${sourceDir}-extract-pty`;
  
  try {
    await rm(tempExtractDir, { force: true, recursive: true });
    await mkdir(tempExtractDir, { recursive: true });
    
    // appAsarPath is already destructured from the parameter object
    if (!appAsarPath) {
      console.warn(`[asar-repack] WARNING: No appAsarPath provided for extraction`);
      return;
    }
    
    runAsarCommand([
      "extract",
      appAsarPath,
      tempExtractDir,
      `--filter=${platformSpecificDir}/**`
    ]);
    
    const extractedPtyPath = `${tempExtractDir}/${platformSpecificDir}`;
    if (await pathExists(extractedPtyPath)) {
      console.log(`[asar-repack] Extracted native modules from asar, copying to staging`);
      const targetDir = resolve(sourceDir, "node_modules", "node-pty", "prebuilds", targetPlatformKey);
      await mkdir(resolve(sourceDir, "node_modules", "node-pty", "prebuilds", targetPlatformKey), { recursive: true });
      await cp(extractedPtyPath, resolve(sourceDir, "node_modules", "node-pty", "prebuilds", targetPlatformKey), { recursive: true });
      console.log(`[asar-repack] Extracted native modules from asar, copying to staging`);
    } else {
      console.warn(`[asar-repack] WARNING: Could not extract native modules from asar at ${platformSpecificDir}`);
    }
  } finally {
    await rm(tempExtractDir, { force: true, recursive: true });
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

  // Extract native modules from the original asar and place them in the staging directory
  // so that the --unpack-dir option can find them during repacking.
  // We need to extract the native modules from the original asar's .unpacked directory
  // (if it exists) or extract them directly from the asar.
  const originalUnpackedPath = `${appAsarPath}.unpacked`;
  const platformSpecificDir = `node_modules/node-pty/prebuilds/${targetPlatformKey}`;
  const sourcePtyPath = `${originalUnpackedPath}/${platformSpecificDir}`;
  const destPtyPath = `${sourceDir}/${platformSpecificDir}`;

  console.log(`[asar-repack] Looking for native modules at: ${sourcePtyPath}`);

  if (await pathExists(sourcePtyPath)) {
    console.log(`[asar-repack] Found native modules at ${sourcePtyPath}, copying to staging`);
    await mkdir(dirname(destPtyPath), { recursive: true });
    await cp(sourcePtyPath, destPtyPath, { recursive: true });
  } else {
    // Try to extract from the original asar directly
    console.log(`[asar-repack] Native modules not found at expected path, extracting from original asar`);
    const tempExtractDir = `${sourceDir}-extract-native`;
    await rm(tempExtractDir, { force: true, recursive: true });
    await mkdir(tempExtractDir, { recursive: true });
    
    try {
      // Extract the specific native module directory from the original asar
      runAsarCommand([
        "extract",
        appAsarPath,
        tempExtractDir,
        `--filter=${platformSpecificDir}/**`
      ]);
      
      const extractedPtyPath = `${tempExtractDir}/${platformSpecificDir}`;
      if (await pathExists(extractedPtyPath)) {
        console.log(`[asar-repack] Extracted native modules from asar, copying to staging`);
        await mkdir(dirname(destPtyPath), { recursive: true });
        await cp(extractedPtyPath, destPtyPath, { recursive: true });
      } else {
        console.warn(`[asar-repack] WARNING: Could not extract native modules from asar at ${platformSpecificDir}`);
      }
    } finally {
      await rm(tempExtractDir, { force: true, recursive: true });
    }
  }

  // Also copy the original .unpacked directory if it exists (for other unpacked files)
  const originalUnpackedPath = `${appAsarPath}.unpacked`;
  if (await pathExists(originalUnpackedPath)) {
    console.log(`[asar-repack] Copying original .unpacked from ${originalUnpackedPath} to ${sourceDir}`);
    await cp(originalUnpackedPath, sourceDir, { recursive: true });
  } else {
    console.log(`[asar-repack] INFO: original .unpacked not found at ${originalUnpackedPath}, skipping copy`);
  }

  // Fallback: ensure node-pty prebuilds exist in staging directory for --unpack-dir to work
  console.log(`[asar-repack] Ensuring node-pty prebuilds in staging...`);
  await ensureNodePtyPrebuildsInStaging({ sourceDir, targetPlatformKey, appAsarPath });
  console.log(`[asar-repack] ensureNodePtyPrebuildsInStaging completed`);

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
