<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>日语 Level 1 · 5份试卷 · 50题</title>
    <style>
        /* ---------- 全局重置 & 主题 ---------- */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            background: #f6f8fc;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }

        .quiz-container {
            max-width: 720px;
            width: 100%;
            background: #ffffff;
            border-radius: 32px;
            box-shadow: 0 20px 60px rgba(0, 20, 40, 0.10);
            padding: 32px 28px 40px;
            transition: box-shadow 0.2s;
        }

        /* ---------- 头部信息 ---------- */
        .quiz-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 8px 12px;
        }

        .quiz-title {
            font-size: 20px;
            font-weight: 700;
            color: #0b1c33;
            letter-spacing: -0.02em;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .quiz-title small {
            font-weight: 400;
            font-size: 14px;
            color: #6b7a8f;
        }

        .quiz-score-wrap {
            background: #eef2f7;
            padding: 6px 16px;
            border-radius: 40px;
            font-size: 15px;
            font-weight: 600;
            color: #0b1c33;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .quiz-score-wrap span {
            color: #2a6df4;
            font-size: 18px;
        }

        /* ---------- 进度条 ---------- */
        .quiz-progress-track {
            width: 100%;
            height: 6px;
            background: #e6ecf3;
            border-radius: 8px;
            margin-bottom: 24px;
            overflow: hidden;
        }

        .quiz-progress-bar {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #2a6df4, #6c9aff);
            border-radius: 8px;
            transition: width 0.4s ease;
        }

        /* ---------- 题目标签 ---------- */
        .quiz-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            color: #6b7a8f;
            margin-bottom: 12px;
            font-weight: 500;
        }

        .quiz-meta .badge {
            background: #eef2f7;
            padding: 2px 14px;
            border-radius: 20px;
            font-size: 12px;
            color: #2c3e5c;
        }

        /* ---------- 题目主体 ---------- */
        .quiz-body {
            min-height: 260px;
            display: flex;
            flex-direction: column;
            gap: 18px;
        }

        .quiz-question {
            font-size: 18px;
            font-weight: 600;
            color: #0b1c33;
            line-height: 1.6;
            padding: 4px 0 2px;
        }

        /* ---------- 选项 ---------- */
        .quiz-options {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 4px;
        }

        .quiz-option {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 18px;
            border: 2px solid #e6ecf3;
            border-radius: 16px;
            background: #fafcff;
            font-size: 16px;
            font-weight: 500;
            color: #0b1c33;
            cursor: pointer;
            transition: all 0.15s ease;
            text-align: left;
            font-family: inherit;
            line-height: 1.4;
        }

        .quiz-option:hover:not(:disabled) {
            border-color: #b8c9e0;
            background: #f2f6fd;
        }

        .quiz-option:disabled {
            cursor: default;
            opacity: 0.7;
        }

        .quiz-option.correct {
            border-color: #1f8b4c;
            background: #e6f7ee;
            color: #0f5a31;
        }

        .quiz-option.wrong {
            border-color: #d14c4c;
            background: #fdeeec;
            color: #9e2d2d;
        }

        .quiz-option .letter {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: #e6ecf3;
            font-size: 13px;
            font-weight: 700;
            color: #2c3e5c;
            flex-shrink: 0;
            transition: 0.15s;
        }

        .quiz-option.correct .letter {
            background: #1f8b4c;
            color: #fff;
        }

        .quiz-option.wrong .letter {
            background: #d14c4c;
            color: #fff;
        }

        /* ---------- 配对题（保留但日语试卷不用） ---------- */
        .match-board {
            display: flex;
            gap: 24px;
            justify-content: center;
            margin: 8px 0 4px;
            flex-wrap: wrap;
        }

        .match-col {
            display: flex;
            flex-direction: column;
            gap: 10px;
            min-width: 120px;
            flex: 1 1 40%;
        }

        .match-item {
            padding: 12px 16px;
            border: 2px solid #dce4ef;
            border-radius: 14px;
            background: #fafcff;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s ease;
            text-align: center;
            font-family: inherit;
            color: #0b1c33;
        }

        .match-item:hover:not(.matched):not(:disabled) {
            border-color: #8aa3c4;
            background: #f0f5fe;
        }

        .match-item.selected {
            border-color: #2a6df4;
            background: #e5edfe;
            box-shadow: 0 0 0 3px rgba(42, 109, 244, 0.15);
        }

        .match-item.matched {
            border-color: #1f8b4c;
            background: #e6f7ee;
            cursor: default;
            opacity: 0.75;
        }

        .match-item:disabled {
            cursor: default;
        }

        /* ---------- 反馈区 ---------- */
        .quiz-feedback {
            margin-top: 18px;
            padding: 14px 18px;
            border-radius: 16px;
            font-size: 15px;
            font-weight: 500;
            line-height: 1.6;
            display: flex;
            flex-direction: column;
            gap: 4px;
            transition: all 0.2s;
            min-height: 54px;
        }

        .quiz-feedback.ok {
            background: #e6f7ee;
            color: #0f5a31;
            border-left: 4px solid #1f8b4c;
        }

        .quiz-feedback.bad {
            background: #fdeeec;
            color: #9e2d2d;
            border-left: 4px solid #d14c4c;
        }

        .quiz-feedback .explanation {
            font-weight: 400;
            font-size: 14px;
            opacity: 0.85;
            margin-top: 4px;
            padding-top: 6px;
            border-top: 1px dashed rgba(0, 0, 0, 0.08);
        }

        .quiz-feedback .explanation strong {
            font-weight: 600;
        }

        /* ---------- 底部按钮 ---------- */
        .quiz-footer {
            display: flex;
            justify-content: flex-end;
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #eef2f7;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 32px;
            border: none;
            border-radius: 40px;
            font-size: 16px;
            font-weight: 600;
            font-family: inherit;
            cursor: pointer;
            transition: all 0.2s ease;
            background: #eef2f7;
            color: #2c3e5c;
        }

        .btn-primary {
            background: #0b1c33;
            color: #ffffff;
        }

        .btn-primary:hover:not(:disabled) {
            background: #1a3050;
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(11, 28, 51, 0.15);
        }

        .btn-primary:disabled {
            opacity: 0.4;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .btn-secondary {
            background: #eef2f7;
            color: #0b1c33;
        }

        .btn-secondary:hover {
            background: #dce4ef;
        }

        /* ---------- 结果页 ---------- */
        .quiz-result {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 12px 0 8px;
        }

        .score-big {
            font-size: 56px;
            font-weight: 800;
            color: #0b1c33;
            letter-spacing: -0.02em;
            margin: 12px 0 4px;
        }

        .score-big span {
            font-size: 24px;
            font-weight: 500;
            color: #6b7a8f;
        }

        .quiz-result .sub-message {
            color: #6b7a8f;
            margin-bottom: 24px;
            font-size: 16px;
        }

        .quiz-type-tag {
            display: inline-block;
            background: #eef2f7;
            padding: 2px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            color: #2c3e5c;
            letter-spacing: 0.3px;
            align-self: flex-start;
            margin-bottom: 4px;
        }

        /* ---------- 响应式 ---------- */
        @media (max-width: 560px) {
            .quiz-container {
                padding: 20px 16px 28px;
                border-radius: 24px;
            }

            .quiz-title {
                font-size: 17px;
            }

            .quiz-question {
                font-size: 16px;
            }

            .quiz-option {
                font-size: 14px;
                padding: 12px 14px;
            }

            .score-big {
                font-size: 40px;
            }

            .match-col {
                min-width: 80px;
            }

            .match-item {
                font-size: 13px;
                padding: 10px 12px;
            }
        }

        @media (max-width: 400px) {
            .quiz-header {
                flex-direction: column;
                align-items: stretch;
                gap: 6px;
            }

            .quiz-score-wrap {
                align-self: flex-start;
            }
        }
    </style>
</head>
<body>

    <div class="quiz-container" id="app">
        <!-- 头部 -->
        <div class="quiz-header">
            <div class="quiz-title">
                📘 日语 Level 1
                <small>5份试卷 · 50题</small>
            </div>
            <div class="quiz-score-wrap">
                🏆 <span id="quiz-score">0</span> 分
            </div>
        </div>

        <!-- 进度条 -->
        <div class="quiz-progress-track">
            <div class="quiz-progress-bar" id="quiz-progress-bar" style="width:0%;"></div>
        </div>

        <!-- 元信息 -->
        <div class="quiz-meta">
            <span id="quiz-index">第 1 / 50 题</span>
            <span class="badge">选择题 · 每题10分</span>
        </div>

        <!-- 题目主体 -->
        <div class="quiz-body" id="quiz-body">
            <!-- 由 JavaScript 动态渲染 -->
        </div>

        <!-- 反馈 -->
        <div class="quiz-feedback" id="quiz-feedback"></div>

        <!-- 底部 -->
        <div class="quiz-footer">
            <button class="btn btn-primary" id="quiz-next-btn" style="display:none;">
                下一题 →
            </button>
        </div>
    </div>

    <script>
        /**
         * ============================================================
         *  日语 Level 1 · 5份试卷 · 共50道选择题
         *  数据来源：平假名、问候、数字、指示词、判断句、
         *  场所时间、日常动词等初学者核心知识
         * ============================================================
         */
        (function() {

            // ---------- 1. 题库数据 ----------
            const QUESTIONS = [
                // ===== 试卷1：平假名与基础问候 =====
                {
                    type: "mc",
                    question: '"こんにちは" 在中文里是什么意思？',
                    options: ["早上好", "你好", "晚安", "谢谢"],
                    answerIndex: 1,
                    explanation: 'こんにちは（Konnichiwa）是日语中最常用的白天问候语，意为"你好"。'
                }, {
                    type: "mc",
                    question: '平假名 "さ" 的正确罗马字发音是？',
                    options: ["sa", "shi", "su", "se"],
                    answerIndex: 0,
                    explanation: 'さ 属于 サ 行假名，读作 sa。'
                }, {
                    type: "mc",
                    question: '"ありがとう" 的意思是？',
                    options: ["对不起", "没关系", "谢谢", "再见"],
                    answerIndex: 2,
                    explanation: 'ありがとう（Arigatou）是表达感谢的常用语，意为"谢谢"。'
                }, {
                    type: "mc",
                    question: '"すみません" 通常在什么场合使用？',
                    options: ["向人打招呼或道歉（不好意思/对不起）", "睡觉前说晚安", "吃饭前表达感谢", "道别时说再见"],
                    answerIndex: 0,
                    explanation: 'すみません（Sumimasen）用于引起他人注意（不好意思）或表示轻微道歉（对不起）。'
                }, {
                    type: "mc",
                    question: '平假名 "ねこ" 对应的中文含义是？',
                    options: ["狗", "猫", "鸟", "鱼"],
                    answerIndex: 1,
                    explanation: 'ねこ（Neko）在日语中写作汉字"猫"，意为猫。'
                }, {
                    type: "mc",
                    question: '片假名 "カメラ" 表示什么？',
                    options: ["电视", "电脑", "相机", "手机"],
                    answerIndex: 2,
                    explanation: 'カメラ（Kamera）来自外来语 Camera，意为相机。'
                }, {
                    type: "mc",
                    question: '表达"我开动了（吃饭前说）"的日语是？',
                    options: ["ごちそうさまでした", "いただきます", "いってきます", "ただいま"],
                    answerIndex: 1,
                    explanation: 'いただきます（Itadakimasu）是日式饮食文化中用餐前说的礼貌用语。'
                }, {
                    type: "mc",
                    question: '"さようなら" 的意思是？',
                    options: ["欢迎光临", "再见", "早上好", "请多指教"],
                    answerIndex: 1,
                    explanation: 'さようなら（Sayounara）表示告别，即"再见"。'
                }, {
                    type: "mc",
                    question: '平假名 "いぬ" 指的是哪种动物？',
                    options: ["猫", "兔子", "狗", "熊"],
                    answerIndex: 2,
                    explanation: 'いぬ（Inu）汉字写作"犬"，即"狗"。'
                }, {
                    type: "mc",
                    question: '"おはようございます" 适用于哪个时间段？',
                    options: ["早晨", "中午", "晚上", "睡前"],
                    answerIndex: 0,
                    explanation: 'おはようございます（Ohayou gozaimasu）是早晨使用的礼貌问候语。'
                },

                // ===== 试卷2：指示代词与数字基础 =====
                {
                    type: "mc",
                    question: '日语数字 "三（さん）" 对应的发音是？',
                    options: ["ichi", "ni", "san", "yon"],
                    answerIndex: 2,
                    explanation: '1=いち, 2=に, 3=さん(san)。'
                }, {
                    type: "mc",
                    question: '"これ" 指的是距离谁较近的事物？',
                    options: ["说话者（这个）", "听话者（那个）", "远处的第三方（那个远处的）", "不确定的事物"],
                    answerIndex: 0,
                    explanation: 'これ（Kore）是指示代词，表示离说话人近的东西，"这个"。'
                }, {
                    type: "mc",
                    question: '"それは何（なん）ですか" 的中文意思是？',
                    options: ["那个人是谁？", "那是什么？", "这个多少钱？", "你去哪里？"],
                    answerIndex: 1,
                    explanation: 'それ（那个）+ は（助词）+ 何（什么）+ ですか（疑问语气）= 那是什么？'
                }, {
                    type: "mc",
                    question: '片假名 "パン" 的意思是？',
                    options: ["米饭", "面包", "牛奶", "水果"],
                    answerIndex: 1,
                    explanation: 'パン（Pan）源自葡萄牙语 pão，意为面包。'
                }, {
                    type: "mc",
                    question: '数字 "10" 在日语里的读音是？',
                    options: ["じゅう (Juu)", "はち (Hachi)", "なな (Nana)", "ろく (Roku)"],
                    answerIndex: 0,
                    explanation: '10 在日语里读作 じゅう (Juu)。'
                }, {
                    type: "mc",
                    question: '表示"远处的那个事物"应该用哪个词？',
                    options: ["これ", "それ", "あれ", "どれ"],
                    answerIndex: 2,
                    explanation: 'あれ（Are）用于指代距离说话人和听话人都较远的事物（那个）。'
                }, {
                    type: "mc",
                    question: '"水（みず）" 的意思是？',
                    options: ["茶", "果汁", "水", "酒"],
                    answerIndex: 2,
                    explanation: '水（みず / Mizu）即为普通饮用水。'
                }, {
                    type: "mc",
                    question: '问句后缀 "〜か" 的作用是？',
                    options: ["表示感叹", "表示疑问", "表示肯定", "表示否定"],
                    answerIndex: 1,
                    explanation: '在句末加上助词"か"，相当于中文的"吗"，用于构成疑问句。'
                }, {
                    type: "mc",
                    question: '"はい" 在答句中表示什么意思？',
                    options: ["不是 / 不", "是的 / 好的", "不知道", "也许"],
                    answerIndex: 1,
                    explanation: 'はい（Hai）表示应答或肯定，意为"是的/好的"。'
                }, {
                    type: "mc",
                    question: '"いいえ" 的中文意思是？',
                    options: ["是的", "不是 / 不", "请", "谢谢"],
                    answerIndex: 1,
                    explanation: 'いいえ（Iie）用于否定回答，意为"不/不是"。'
                },

                // ===== 试卷3：基础判断句与名词助词 =====
                {
                    type: "mc",
                    question: '"わたしは学生（がくせい）です" 的意思是？',
                    options: ["我是老师", "我是学生", "我是医生", "我是公司职员"],
                    answerIndex: 1,
                    explanation: 'わたし（我）+ は（提示主语）+ 学生（学生）+ です（是）= 我是学生。'
                }, {
                    type: "mc",
                    question: '助词 "は" 作为主语提示助词时，实际发音是？',
                    options: ["ha", "wa", "ba", "ma"],
                    answerIndex: 1,
                    explanation: '假名"は"作为句中助词使用时，读作"wa"。'
                }, {
                    type: "mc",
                    question: '否定句 "〜ではありません" 表示什么意思？',
                    options: ["是……", "不是……", "有……", "去……"],
                    answerIndex: 1,
                    explanation: 'ではありません（Dewa arimasen）是判断句 です 的礼貌否定形式，"不是……"。'
                }, {
                    type: "mc",
                    question: '"先生（せんせい）" 在日语中通常指什么职业？',
                    options: ["学生", "老师/医生", "司机", "厨师"],
                    answerIndex: 1,
                    explanation: '先生（Sensei）在日语中用来尊称教师、医生、律师等专业人士。'
                }, {
                    type: "mc",
                    question: '"本（ほん）" 对应的中文含义是？',
                    options: ["笔", "纸", "书", "包"],
                    answerIndex: 2,
                    explanation: '本（ほん / Hon）意为"书本"。'
                }, {
                    type: "mc",
                    question: '助词 "の" 的主要功能相当于中文的？',
                    options: ["和", "在", "的", "被"],
                    answerIndex: 2,
                    explanation: '助词"の"连接两个名词，表示所属或限定关系，相当于"的"（如：わたしの本 = 我的书）。'
                }, {
                    type: "mc",
                    question: '"わたしの本" 翻译成中文是？',
                    options: ["他的书", "我的书", "你的书", "谁的书"],
                    answerIndex: 1,
                    explanation: 'わたし（我）+ の（的）+ 本（书）= 我的书。'
                }, {
                    type: "mc",
                    question: '"日本人（にほんじん）" 的意思是？',
                    options: ["日本语言", "日本文化", "日本人", "日本食品"],
                    answerIndex: 2,
                    explanation: '国家名 + 人（じん）表示该国的人。'
                }, {
                    type: "mc",
                    question: '片假名 "トイレ" 指什么地方？',
                    options: ["厨房", "卧室", "洗手间/厕所", "客厅"],
                    answerIndex: 2,
                    explanation: 'トイレ（Toire）源自英语 Toilet，意为洗手间。'
                }, {
                    type: "mc",
                    question: '"どなた" 或 "だれ" 用于询问什么？',
                    options: ["什么时候", "哪里", "谁", "为什么"],
                    answerIndex: 2,
                    explanation: 'だれ / どなた（礼貌形）表示疑问代词"谁"。'
                },

                // ===== 试卷4：场所、时间与简单动词 =====
                {
                    type: "mc",
                    question: '"ここ" 表示什么位置？',
                    options: ["这里", "那里", "哪里", "上面"],
                    answerIndex: 0,
                    explanation: 'ここ（Koko）表示距离说话人近的地点，"这里"。'
                }, {
                    type: "mc",
                    question: '"どこですか" 是在询问什么？',
                    options: ["是什么？", "是哪位？", "在哪里？", "多少钱？"],
                    answerIndex: 2,
                    explanation: 'どこ（哪里）+ ですか（疑问）= 在哪里？'
                }, {
                    type: "mc",
                    question: '"今（いま）" 的意思是？',
                    options: ["昨天", "现在", "明天", "上午"],
                    answerIndex: 1,
                    explanation: '今（いま / Ima）意为"现在"。'
                }, {
                    type: "mc",
                    question: '表达"几点"的日语疑问词是？',
                    options: ["何時（なんじ）", "何日（なんにち）", "何人（なにじん）", "何歳（なんさい）"],
                    answerIndex: 0,
                    explanation: '何時（なんじ / Nan-ji）表示"几点钟"。'
                }, {
                    type: "mc",
                    question: '动词 "行（い）きます" 的意思是？',
                    options: ["来", "去", "吃", "看"],
                    answerIndex: 1,
                    explanation: '行きます（Ikimasu）意为"去"。'
                }, {
                    type: "mc",
                    question: '动词 "来（き）ます" 的意思是？',
                    options: ["去", "返回", "来", "走"],
                    answerIndex: 2,
                    explanation: '来ます（Kimasu）意为"来"。'
                }, {
                    type: "mc",
                    question: '"今日（きょう）" 表示什么时间？',
                    options: ["明天", "今天", "昨天", "每天"],
                    answerIndex: 1,
                    explanation: '今日（きょう / Kyou）意为"今天"。'
                }, {
                    type: "mc",
                    question: '"明日（あした）" 的意思是？',
                    options: ["明天", "昨天", "后天", "大后天"],
                    answerIndex: 0,
                    explanation: '明日（あした / Ashita）意为"明天"。'
                }, {
                    type: "mc",
                    question: '片假名 "レストラン" 是指什么场所？',
                    options: ["银行", "邮局", "餐厅", "医院"],
                    answerIndex: 2,
                    explanation: 'レストラン（Resutoran）源自 Restaurant，意为餐厅。'
                }, {
                    type: "mc",
                    question: '"いくらですか" 用于询问什么？',
                    options: ["时间", "年龄", "价格（多少钱）", "数量"],
                    answerIndex: 2,
                    explanation: 'いくら（Ikura）用于询问商品或服务的价格，意为"多少钱？"。'
                },

                // ===== 试卷5：日常活动与基础宾语 =====
                {
                    type: "mc",
                    question: '动词 "食（た）べます" 的意思是？',
                    options: ["喝", "吃", "买", "做"],
                    answerIndex: 1,
                    explanation: '食べます（Tabemasu）意为"吃"。'
                }, {
                    type: "mc",
                    question: '"飲（の）みます" 表示什么动作？',
                    options: ["喝", "听", "读", "写"],
                    answerIndex: 0,
                    explanation: '飲みます（Nomimasu）意为"喝"。'
                }, {
                    type: "mc",
                    question: '助词 "を" 在句子中的作用是？',
                    options: ["提示主语", "提示动作的直接宾语", "表示时间点", "表示并列"],
                    answerIndex: 1,
                    explanation: '助词"を"（读作 o）放在名词后，提示后续动词的作用对象（直接宾语）。'
                }, {
                    type: "mc",
                    question: '"ご飯（はん）を食べます" 的意思是？',
                    options: ["买米饭", "吃饭", "做饭", "卖饭"],
                    answerIndex: 1,
                    explanation: 'ご飯（饭）+ を（宾语助词）+ 食べます（吃）= 吃饭。'
                }, {
                    type: "mc",
                    question: '"水（みず）を飲みます" 翻译为？',
                    options: ["买水", "倒水", "喝水", "烧水"],
                    answerIndex: 2,
                    explanation: '水（水）+ を + 飲みます（喝）= 喝水。'
                }, {
                    type: "mc",
                    question: '动词 "見（み）ます" 的意思是？',
                    options: ["听", "看", "说", "想"],
                    answerIndex: 1,
                    explanation: '見ます（Mimasu）意为"看"（如看电视、看电影）。'
                }, {
                    type: "mc",
                    question: '"買（か）います" 的意思是？',
                    options: ["卖", "借", "买", "送"],
                    answerIndex: 2,
                    explanation: '買います（Kaimasu）意为"购买"。'
                }, {
                    type: "mc",
                    question: '"新聞（しんぶん）" 在日语里是指？',
                    options: ["新闻广播", "报纸", "杂志", "信件"],
                    answerIndex: 1,
                    explanation: '新聞（しんぶん / Shinbun）在日语里的意思是"报纸"。'
                }, {
                    type: "mc",
                    question: '"テレビを見ます" 的意思是？',
                    options: ["听广播", "看电视", "买电视", "修电视"],
                    answerIndex: 1,
                    explanation: 'テレビ（电视）+ を + 見ます（看）= 看电视。'
                }, {
                    type: "mc",
                    question: '动词否定形式 "〜ません" 表示什么？',
                    options: ["正在做……", "不做…… / 不会……", "想做……", "做了……"],
                    answerIndex: 1,
                    explanation: '〜ません（masen）是动词 ます 形的礼貌否定式，表示不进行某种动作。'
                }
            ];

            // ---------- 2. 状态 ----------
            let currentIndex = 0;
            let score = 0;
            let currentQuestionSolved = false;

            // ---------- 3. DOM 引用 ----------
            const quizBody = document.getElementById('quiz-body');
            const quizFeedback = document.getElementById('quiz-feedback');
            const quizIndexLabel = document.getElementById('quiz-index');
            const quizProgressBar = document.getElementById('quiz-progress-bar');
            const quizScoreLabel = document.getElementById('quiz-score');
            const nextBtn = document.getElementById('quiz-next-btn');

            if (!quizBody) return;

            // ---------- 4. 渲染当前题 ----------
            function renderQuestion() {
                currentQuestionSolved = false;
                quizFeedback.textContent = '';
                quizFeedback.className = 'quiz-feedback';
                nextBtn.style.display = 'none';

                const q = QUESTIONS[currentIndex];
                const total = QUESTIONS.length;
                quizIndexLabel.textContent = '第 ' + (currentIndex + 1) + ' / ' + total + ' 题';
                quizProgressBar.style.width = ((currentIndex) / total) * 100 + '%';

                if (q.type === 'mc') {
                    renderMultipleChoice(q);
                } else if (q.type === 'match') {
                    renderMatch(q);
                }
            }

            // ---------- 5. 选择题 ----------
            function renderMultipleChoice(q) {
                const letters = ['A', 'B', 'C', 'D'];
                quizBody.innerHTML = `
              <span class="quiz-type-tag">选择题</span>
              <div class="quiz-question">${q.question}</div>
              <div class="quiz-options">
                ${q.options.map((opt, i) => `
                  <button class="quiz-option" data-index="${i}">
                    <span class="letter">${letters[i]}</span>
                    ${opt}
                  </button>
                `).join('')}
              </div>
            `;

                const optionButtons = quizBody.querySelectorAll('.quiz-option');
                optionButtons.forEach((btn) => {
                    btn.addEventListener('click', function() {
                        if (currentQuestionSolved) return;
                        currentQuestionSolved = true;

                        const chosenIndex = parseInt(btn.getAttribute('data-index'), 10);
                        const isCorrect = chosenIndex === q.answerIndex;

                        optionButtons.forEach((b) => b.disabled = true);

                        if (isCorrect) {
                            btn.classList.add('correct');
                            score += 10;
                            quizScoreLabel.textContent = score;
                            showFeedback('✅ 回答正确！ +10 分', true, q.explanation);
                        } else {
                            btn.classList.add('wrong');
                            optionButtons[q.answerIndex].classList.add('correct');
                            showFeedback('❌ 答错了，正确答案是：' + q.options[q.answerIndex], false, q.explanation);
                        }

                        nextBtn.style.display = 'inline-flex';
                    });
                });
            }

            // ---------- 6. 配对题（保留但本数据不用） ----------
            function renderMatch(q) {
                const leftItems = q.pairs.map((p, i) => ({ text: p.en, pairId: i }));
                const rightItems = shuffleArray(
                    q.pairs.map((p, i) => ({ text: p.zh, pairId: i }))
                );

                quizBody.innerHTML = `
              <span class="quiz-type-tag">单词配对</span>
              <div class="quiz-question">点击左右两侧，把英文和对应的中文配成一对</div>
              <div class="match-board">
                <div class="match-col" id="match-left"></div>
                <div class="match-col" id="match-right"></div>
              </div>
            `;

                const leftCol = quizBody.querySelector('#match-left');
                const rightCol = quizBody.querySelector('#match-right');

                leftItems.forEach((item) => {
                    const el = document.createElement('button');
                    el.className = 'match-item';
                    el.textContent = item.text;
                    el.dataset.pairId = item.pairId;
                    el.dataset.side = 'left';
                    leftCol.appendChild(el);
                });

                rightItems.forEach((item) => {
                    const el = document.createElement('button');
                    el.className = 'match-item';
                    el.textContent = item.text;
                    el.dataset.pairId = item.pairId;
                    el.dataset.side = 'right';
                    rightCol.appendChild(el);
                });

                let selectedLeft = null;
                let selectedRight = null;
                let matchedCount = 0;

                function handleSelect(el) {
                    if (el.classList.contains('matched')) return;
                    const side = el.dataset.side;
                    if (side === 'left') {
                        if (selectedLeft) selectedLeft.classList.remove('selected');
                        selectedLeft = el;
                        el.classList.add('selected');
                    } else {
                        if (selectedRight) selectedRight.classList.remove('selected');
                        selectedRight = el;
                        el.classList.add('selected');
                    }

                    if (selectedLeft && selectedRight) {
                        const isMatch = selectedLeft.dataset.pairId === selectedRight.dataset.pairId;
                        if (isMatch) {
                            selectedLeft.classList.remove('selected');
                            selectedRight.classList.remove('selected');
                            selectedLeft.classList.add('matched');
                            selectedRight.classList.add('matched');
                            selectedLeft.disabled = true;
                            selectedRight.disabled = true;
                            matchedCount++;
                            score += 5;
                            quizScoreLabel.textContent = score;
                            showFeedback('✅ 配对正确！ +5 分', true, '');

                            selectedLeft = null;
                            selectedRight = null;

                            if (matchedCount === q.pairs.length) {
                                currentQuestionSolved = true;
                                showFeedback('🎉 全部配对完成！本题得分 +' + (q.pairs.length * 5), true, '');
                                nextBtn.style.display = 'inline-flex';
                            }
                        } else {
                            showFeedback('❌ 配对不正确，再试试～', false, '');
                            const wrongLeft = selectedLeft;
                            const wrongRight = selectedRight;
                            setTimeout(() => {
                                wrongLeft.classList.remove('selected');
                                wrongRight.classList.remove('selected');
                            }, 400);
                            selectedLeft = null;
                            selectedRight = null;
                        }
                    }
                }

                quizBody.querySelectorAll('.match-item').forEach((el) => {
                    el.addEventListener('click', () => handleSelect(el));
                });
            }

            // ---------- 7. 工具 ----------
            function shuffleArray(arr) {
                const copy = arr.slice();
                for (let i = copy.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [copy[i], copy[j]] = [copy[j], copy[i]];
                }
                return copy;
            }

            function showFeedback(text, isOk, explanation) {
                quizFeedback.textContent = text;
                quizFeedback.className = 'quiz-feedback ' + (isOk ? 'ok' : 'bad');
                if (explanation) {
                    const expl = document.createElement('div');
                    expl.className = 'explanation';
                    expl.innerHTML = '💡 <strong>解析：</strong>' + explanation;
                    quizFeedback.appendChild(expl);
                }
            }

            // ---------- 8. 结果页 ----------
            function renderResult() {
                const total = QUESTIONS.length;
                quizIndexLabel.textContent = '已完成 🎉';
                quizProgressBar.style.width = '100%';
                quizFeedback.textContent = '';
                nextBtn.style.display = 'none';

                const maxScore = total * 10; // 全部是选择题，每题10分
                quizBody.innerHTML = `
              <div class="quiz-result">
                <span class="quiz-type-tag">测验完成</span>
                <div class="quiz-question" style="font-weight:600; margin-top:6px;">你的最终成绩</div>
                <div class="score-big">${score} <span>/ ${maxScore}</span></div>
                <p class="sub-message">
                  ${score === maxScore ? '🌟 太厉害了，满分通过！' :
                    score >= maxScore * 0.7 ? '💪 很不错，继续加油！' :
                    '📖 再练练，你一定能更好！'}
                </p>
                <button class="btn btn-primary" id="quiz-restart-btn">🔄 重新测验</button>
              </div>
            `;

                document.getElementById('quiz-restart-btn').addEventListener('click', function() {
                    currentIndex = 0;
                    score = 0;
                    quizScoreLabel.textContent = '0';
                    renderQuestion();
                });
            }

            // ---------- 9. 下一题 ----------
            nextBtn.addEventListener('click', function() {
                if (!currentQuestionSolved) return;
                currentIndex++;
                if (currentIndex >= QUESTIONS.length) {
                    renderResult();
                } else {
                    renderQuestion();
                }
            });

            // ---------- 10. 启动 ----------
            renderQuestion();

        })();
    </script>

</body>
</html>
