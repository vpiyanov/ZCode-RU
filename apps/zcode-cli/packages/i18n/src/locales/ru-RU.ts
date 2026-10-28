import type { ZCodeCopy } from "../types.js";

export const ruRU: ZCodeCopy = {
  locale: "ru-RU",
  cli: {
    errors: {
      localeUnsupported: (value) =>
        `Неподдерживаемое значение --locale: ${value}. Поддерживаемые языки: en-US, zh-CN, ru-RU, auto.`,
    },
    help: (version) => `zcode ${version}

Использование:
  zcode [команда] [параметры]

Без команды zcode открывает полноэкранный TUI.

Команды:
  app-server Запустить сервер приложений ZCode Protocol через stdio
  commands   Список пользовательских слэш-команд (\`commands list\`)
  doctor     Проверить окружение выполнения и предположения об упаковке
  login [zai|bigmodel]  Войти через авторизацию в браузере
  logout     Удалить общие учётные данные входа Z.AI
  plugins    Управление плагинами и маркетплейсами (\`plugins list|install|uninstall|enable|disable|update|validate|marketplace ...\`; псевдоним: plugin)
  skills     Список локальных навыков (\`skills list\`)
  tui        Открыть терминальный интерфейс
  version    Показать версию CLI

Параметры:
  -h, --help       Показать справку
  -v, --version    Показать версию
  -p, --prompt <text>  Выполнить один запрос без открытия TUI
  --memory-bench   С --prompt включить автоматическое извлечение Memory и дождаться завершения перед выходом (требуется включённая Memory)
  --browser-use <mode> Включить бэкенд Browser Use (поддерживается: headless)
  --surface <surface>  Поверхность представления для headless-запросов/app-server: terminal или desktop
  --browser-executable <path> Исполняемый файл Chrome/Chromium для headless Browser Use
  --attach <path>  Прикрепить локальный файл к --prompt; повторяйте для нескольких файлов
  --cwd <path>     Выполнить команду из указанного каталога
  --disallowed-tools, --disallowedTools <tools...>
    Убрать целые инструменты только для этого запроса/запуска TUI; сохранённые настройки не меняются.
    Имена инструментов через запятую или пробел, например "Bash Edit".
    "Bash(git *)" убирает весь Bash; шаблоны команд не сопоставляются.
  --toolsearch-mode <auto|native|local|off> Режим ToolSearch (по умолчанию: off; только для этого запуска)
  --force-mcs      Принудительная проекция системы в середине беседы для провайдеров Anthropic
  --locale <locale>  Язык интерфейса: en-US, zh-CN, ru-RU или auto
  --mode <mode>    Режим разрешений для запросов: build, edit, plan, yolo или guarded (по умолчанию: yolo для --prompt)
  --resume <sessionId>  Возобновить сохранённую сессию по sessionId (sess_...)
  --target <text>  Выполнить или задать цель сессии в headless-режиме
  --target-replace Заменить существующую цель сессии, заданную через --target
  --workflow-mode <mode>  Динамические workflow для запросов/TUI: disabled, onDemand или alwaysOn (по умолчанию: disabled)
  -c, --continue        Возобновить последнюю сессию для текущего каталога
  --json           Выводить машиночитаемый JSON там, где поддерживается
  --no-browser     Вывести URL OAuth без открытия браузера
  --no-color       Отключить цвета ANSI
  --verbose        Выводить дополнительную диагностическую информацию

Слэш-команды:
  /help [command]       Показать справку по слэш-командам
  /login                Выбрать вход через браузер Z.AI или BigModel
  /logout               Удалить общие учётные данные входа Z.AI
  /compact [instructions]  Сжать текущую беседу
  /expert [status|resume|stop|<task>]  Запустить или настроить процесс эксперта
  /dwf [list|cancel|resume]  Список, отмена или возобновление запусков динамических workflow
  /fork [latest|checkpointId]  Ответвить новую сессию от контрольной точки рабочей области
  /mcp [list|status|connect|disconnect]  Показать или настроить серверы MCP
  /mode [mode]          Показать или переключить режим разрешений: build, edit, plan, yolo или guarded
  /model [id]           Показать или переключить модель текущей сессии
  /new                  Начать новую сессию в TUI
  /resume [sessionId]   Возобновить сессию по sessionId; без него — последнюю в текущем каталоге
  /rewind [latest|checkpointId]  Показать последнюю контрольную точку или восстановить файлы рабочей области
  /skill [name] [task]  Список навыков или принудительная загрузка навыка для следующего запроса
  /goal [action]        Показать или задать цель текущей сессии
`,
  },
  tui: {
    copy: {
      copied: "Выделенный текст скопирован в буфер обмена.",
      failed: "Не удалось скопировать выделенный текст.",
      unavailable: "Копирование текста в буфер обмена недоступно в этом терминале.",
    },
    effort: {
      disabled: "выключено",
      enabled: "включено",
    },
    input: {
      activeStatusHint: "esc — прервать",
      busyPlaceholder: "Введите текст, чтобы поставить в очередь",
      placeholder: "Введите запрос",
      queuedMore: (count) => `+ ещё ${count} в очереди`,
      queuedSubmitHint: "Будет отправлено после следующего вызова инструмента.",
      queuedTitle: (count) => ` Очередь (${count}) `,
      title: "Ввод",
      noHistorySource: "Источник истории ввода не настроен.",
      noPreviousInput: "Для этого проекта нет предыдущего ввода.",
      restoredPreviousInput: "Предыдущий ввод восстановлен.",
      restoredPreviousInputWithAttachments: (count) =>
        `Предыдущий ввод восстановлен с вложениями (${count}).`,
      restorePreviousInputFailed: "Не удалось восстановить предыдущий ввод.",
      typePrompt: "Введите вопрос и нажмите Enter.",
    },
    loginRequired: {
      help: "Используйте /model для просмотра моделей или /login, чтобы подключить учётную запись Coding Plan.",
      message: "Нет доступных моделей. Настройте провайдера или войдите через /login.",
      status: "Нет доступных моделей. Настройте провайдера или войдите через /login.",
      title: "требуется настройка модели",
    },
    loginSetup: {
      emptyMessage: "Нет доступных вариантов входа.",
      help: "Стрелки вверх/вниз — выбор, Enter — подтвердить.",
      options: {
        bigmodelApiKey: {
          inputPrimary: "Введите API-ключ BigModel Coding Plan",
          inputSecondary: "Вставьте ключ сюда. При вводе он скрыт.",
          primary: "API-ключ BigModel Coding Plan",
          secondary: "Вставьте API-ключ Coding Plan вручную.",
        },
        bigmodelOauth: {
          pendingPrimary: "Ожидание авторизации BigModel",
          pendingSecondary:
            "Завершите вход в браузере. Авторизация определяется автоматически.",
          primary: "BigModel Coding Plan",
          secondary: "Открыть вход через браузер; авторизация определяется автоматически.",
        },
        zaiApiKey: {
          inputPrimary: "Введите API-ключ Z.AI Coding Plan",
          inputSecondary: "Вставьте ключ сюда. При вводе он скрыт.",
          primary: "API-ключ Z.AI Coding Plan",
          secondary: "Вставьте API-ключ Coding Plan вручную.",
        },
        zaiOauth: {
          pendingPrimary: "Ожидание авторизации Z.AI",
          pendingSecondary:
            "Завершите вход в браузере. Я продолжу, когда авторизация завершится.",
          primary: "Z.AI Coding Plan",
          secondary: "Открыть вход через браузер и создать API-ключ Coding Plan.",
        },
      },
      pending: {
        cancelStatus: "Вход отменён. Выберите способ настройки.",
        help: "Esc отменяет и возвращает к выбору способа настройки.",
        status: "Ожидание авторизации в браузере…",
      },
      input: {
        cancelStatus: "Ввод API-ключа отменён. Выберите способ настройки.",
        clearStatus: "Ввод API-ключа очищен.",
        emptyStatus: "Необходим API-ключ.",
        help: "Enter сохраняет ключ. Esc возвращает к выбору способа настройки.",
        placeholder: "Вставьте API-ключ",
        status: "Введите API-ключ и нажмите Enter.",
        submitStatus: "Сохранение API-ключа…",
      },
      prompt: "Выберите способ входа или настройки API-ключа.",
      response: "Выберите способ настройки провайдера Coding Plan.",
      title: "Настройка Coding Plan",
    },
    model: {
      requestFailed: (message) => `Ошибка запроса к модели: ${message}`,
      responseReceived: "Ответ модели получен.",
      responseReceivedWithTokens: (tokens) => `Ответ модели получен. Токенов: ${tokens}.`,
      retryScheduled: ({ attempt, delay, maxAttempts, reason }) =>
        `Повтор запроса к модели ${attempt}/${Math.max(1, maxAttempts - 1)} через ${delay}: ${reason}`,
      streamStalled: "Поток модели завис.",
    },
    sidebar: {
      subagents: {
        title: "Субагенты",
        empty: "Субагентов пока нет.",
        emptyOutput: "Вывод пока отсутствует.",
        back: "← Основная беседа",
        readonly: "Только чтение · Esc — вернуться",
        loading: "Загрузка вывода субагента…",
        unavailable: "Вывод субагента недоступен.",
        retry: "Повторить",
        more: "Загрузить ещё",
        pendingMain: "Основная беседа ждёт вашего ввода — вернитесь, чтобы ответить",
        ended: (count) => `Завершено (${count})`,
        status: {
          running: "выполняется",
          waiting: "ожидает",
          blocked: "заблокировано",
          success: "завершено",
          failed: "ошибка",
          cancelled: "отменено",
          lost: "потеряно",
        },
      },
      api: {
        empty: "Вызовов API пока нет.",
        model: "Модель",
        more: (count) => `+ещё ${count}`,
        requests: "Запросы",
        server: "Сервер",
      },
      cache: {
        hit: "попадание",
        lastHit: "последнее попадание",
        lastMiss: "последний промах",
        readWrite: ({ read, write }) => `${read} чтение / ${write} запись`,
        total: "всего",
      },
      context: {
        cache: "Кэш",
        cacheReadWrite: "Кэш Ч/З",
        inputOutput: "Ввод/вывод",
        reason: "Причина",
        tokens: "Токены",
        used: "Использовано",
        window: "Окно",
      },
      modifiedFiles: {
        empty: "Изменений файлов пока нет.",
        more: (count) => `+ещё ${count}`,
      },
      mcp: {
        empty: "Серверы MCP не настроены.",
        loadFailed: "Состояние MCP недоступно.",
        loading: "Загрузка состояния MCP…",
        more: (count) => `+ещё ${count}`,
        servers: "Серверы",
        status: {
          connected: "подключено",
          connecting: "подключение",
          disabled: "отключено",
          disconnected: "не подключено",
          failed: "ошибка",
          untrusted: "не доверено",
        },
        summary: ({ connected, total }) => `Подключено: ${connected}/${total}`,
        tools: (count) => `Инструментов: ${count}`,
      },
      request: {
        complete: "завершено",
        error: "ошибка",
        errorWithStatus: (statusCode) => `ошибка ${statusCode}`,
        pending: "в ожидании",
      },
      status: {
        last: "Последнее",
      },
      run: {
        draft: "Черновик",
        draftChars: (count) => `Символов: ${count}`,
        draftEmpty: "пусто",
        messages: "Сообщения",
        mode: "Режим",
        model: "Модель",
        provider: "Провайдер",
        thought: "Рассуждение",
        trace: "Трассировка",
        turn: "Ход",
        workspace: "Рабочая область",
      },
      sections: {
        apis: "API",
        context: "Контекст",
        mcp: "MCP",
        modifiedFiles: "Изменённые файлы",
        run: "Запуск",
        status: "Статус",
        todos: "Задачи",
      },
      shellSubtitle: "Оболочка OpenTUI",
      title: "Боковая панель",
      todos: {
        empty: "Задач пока нет.",
        more: (count) => `+ещё ${count}`,
        progress: "Прогресс",
      },
    },
    status: {
      compactFailed: "Не удалось сжать контекст.",
      compacted: "Беседа сжата.",
      compacting: "Сжатие контекста…",
      interruptedStreamDiscarded: "Прерванный поток модели отброшен.",
      modelCalling: "Вызов модели…",
      permissionRequested: (toolName) => `Запрошено разрешение для ${toolName}.`,
      permissionResolved: (toolName) => `Разрешение для ${toolName} урегулировано.`,
      ready: "Готово.",
      recoveringStream: "Восстановление прерванного потока модели…",
      retryingStream: "Повтор потока модели…",
      sessionResumed: "Сессия возобновлена.",
      targetChanged: (action) => `Цель: ${action}.`,
      thinking: "Размышление…",
      toolCompleted: (toolName) => `Инструмент ${toolName} завершён.`,
      toolFailed: (toolName) => `Инструмент ${toolName} завершился с ошибкой.`,
      toolPending: (toolName) => `Инструмент ${toolName} в ожидании.`,
      toolRunning: (toolName) => `Инструмент ${toolName} выполняется.`,
      turnFailed: "Ход завершился с ошибкой.",
    },
    terminal: {
      requiresInteractive: "Для TUI требуется интерактивный терминал.",
      starting: "Запуск ZCode… Ctrl+C — выйти",
    },
    transcript: {
      compact: {
        completed: "Контекст сжат",
        failed: "Не удалось сжать контекст",
        interrupted: "Сжатие контекста прервано",
        retry: (command) => `Ctrl-R — повторить ${command}`,
        retrying: ({ attempt, maxAttempts }) =>
          maxAttempts > 0
            ? `Повтор сжатия контекста (${attempt}/${maxAttempts})`
            : "Повтор сжатия контекста",
        skipped: "Контекст актуален; сжатие не требуется",
        started: "Сжатие контекста",
      },
      roles: {
        agent: "Агент",
        system: "Система",
        user: "Пользователь",
      },
      thought: {
        complete: "Рассуждение",
        thinking: "Размышление…",
      },
      title: "Транскрипт",
      workflow: {
        actors: "участники:",
        actorRow: ({ name, status }) => `${name} — ${status}`,
        usage: ({ spentTokens }) => `использовано: ${spentTokens} токенов`,
        collapsed: ({ label, status, nodesSettled, nodesTotal }) =>
          `Workflow ${label} — ${status} (${nodesSettled}/${nodesTotal} шагов)`,
        error: (message) => `ошибка: ${message}`,
        expandHint: "+ — развернуть",
        collapseHint: "- — свернуть",
        log: "журнал:",
        nodes: ({ nodesSettled, nodesTotal }) => `завершено шагов: ${nodesSettled}/${nodesTotal}`,
        result: (preview) => `результат: ${preview}`,
        status: {
          completed: "завершено",
          errored: "ошибка",
          pending: "в ожидании",
          running: "выполняется",
          stopped: "остановлено",
        },
        stopReason: {
          user: "вами",
          model: "агентом",
          provider: "ошибка модели",
          interrupted: "процесс завершился",
          superseded: "заменено исправленным запуском",
        },
        truncated: "(обрезано — полная история в журнале запуска)",
        interruptedNotice: ({ label, runId }) =>
          `Workflow ${label} был прерван, его можно возобновить: /dwf resume ${runId}`,
      },
    },
    selection: {
      defaultHelp: "Enter — выбрать, Esc — отменить",
      disabled: (reason) => ` [недоступно: ${reason}]`,
      filterLine: ({ filter, help }) =>
        `фильтр: ${filter || "-"} | ${help ?? "Enter — выбрать, Esc — отменить"}`,
      noFilter: "-",
    },
    fileMention: {
      empty: "Нет подходящих путей в рабочей области.",
      loading: "Загрузка путей рабочей области…",
      row: ({ path, selected }) => `${selected ? ">" : " "} ${path}`,
      title: "Файлы",
    },
    slash: {
      title: "Команды",
      row: ({ name, selected, summary }) => `${selected ? ">" : " "} /${name}  ${summary}`,
    },
  },
};
