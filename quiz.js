/**
 * quiz.js —— 日语 Level 1 · 5份试卷 · 中英双语
 * 功能：
 *   - 试卷选择（5份，每卷10题）
 *   - 中英文界面切换
 *   - 选择题作答、计分、解析
 *   - 完成试卷后显示得分
 * 依赖 DOM：需存在 id 为 quiz-body, quiz-feedback, quiz-index,
 *   quiz-progress-bar, quiz-score, quiz-next-btn 的元素。
 *   语言切换按钮会自动创建并插入到 .quiz-header 中（若存在），
 *   否则追加到 document.body 开头。
 */

(function () {
  'use strict';

  // ---------- 1. 题库数据 (中英双语) ----------
  const PAPERS = [
    {
      id: 1,
      titleZh: '试卷1：平假名与基础问候',
      titleEn: 'Paper 1: Hiragana & Basic Greetings',
      questions: [
        {
          q: { zh: '"こんにちは" 在中文里是什么意思？', en: 'What does "こんにちは" mean in English?' },
          opts: { zh: ['早上好', '你好', '晚安', '谢谢'], en: ['Good morning', 'Hello / Good afternoon', 'Good night', 'Thank you'] },
          ans: 1,
          exp: { zh: 'こんにちは（Konnichiwa）是日语中最常用的白天问候语，意为"你好"。', en: 'こんにちは (Konnichiwa) is the most common daytime greeting in Japanese, meaning "Hello" or "Good afternoon".' }
        },
        {
          q: { zh: '平假名 "さ" 的正确罗马字发音是？', en: 'What is the correct Romaji pronunciation for the Hiragana "さ"?' },
          opts: { zh: ['sa', 'shi', 'su', 'se'], en: ['sa', 'shi', 'su', 'se'] },
          ans: 0,
          exp: { zh: 'さ 属于 サ 行假名，读作 sa。', en: 'さ belongs to the Sa-row kana and is pronounced as "sa".' }
        },
        {
          q: { zh: '"ありがとう" 的意思是？', en: 'What is the meaning of "ありがとう"?' },
          opts: { zh: ['对不起', '没关系', '谢谢', '再见'], en: ["I'm sorry", "You're welcome", "Thank you", "Goodbye"] },
          ans: 2,
          exp: { zh: 'ありがとう（Arigatou）是表达感谢的常用语，意为"谢谢"。', en: 'ありがとう (Arigatou) is a common expression used to say "Thank you".' }
        },
        {
          q: { zh: '"すみません" 通常在什么场合使用？', en: 'When is "すみません" typically used?' },
          opts: { zh: ['向人打招呼或道歉（不好意思/对不起）', '睡觉前说晚安', '吃饭前表达感谢', '道别时说再见'], en: ['To get someone\'s attention or apologize (Excuse me / I\'m sorry)', 'Before going to bed (Good night)', 'Before eating a meal', 'When saying goodbye'] },
          ans: 0,
          exp: { zh: 'すみません（Sumimasen）用于引起他人注意（不好意思）或表示轻微道歉（对不起）。', en: 'すみません (Sumimasen) is used to get attention ("Excuse me") or express a mild apology ("I\'m sorry").' }
        },
        {
          q: { zh: '平假名 "ねこ" 对应的中文含义是？', en: 'What does the Hiragana "ねこ" refer to?' },
          opts: { zh: ['狗', '猫', '鸟', '鱼'], en: ['Dog', 'Cat', 'Bird', 'Fish'] },
          ans: 1,
          exp: { zh: 'ねこ（Neko）在日语中写作汉字"猫"，意为猫。', en: 'ねこ (Neko) is written as "猫" in Kanji, which means "Cat".' }
        },
        {
          q: { zh: '片假名 "カメラ" 表示什么？', en: 'What does the Katakana "カメラ" mean?' },
          opts: { zh: ['电视', '电脑', '相机', '手机'], en: ['Television', 'Computer', 'Camera', 'Mobile phone'] },
          ans: 2,
          exp: { zh: 'カメラ（Kamera）来自外来语 Camera，意为相机。', en: 'カメラ (Kamera) comes from the English loanword "Camera".' }
        },
        {
          q: { zh: '表达"我开动了（吃饭前说）"的日语是？', en: 'Which phrase is used before eating a meal ("Bon appétit")?' },
          opts: { zh: ['ごちそうさまでした', 'いただきます', 'いってきます', 'ただいま'], en: ['ごちそうさまでした', 'いただきます', 'いってきます', 'ただいま'] },
          ans: 1,
          exp: { zh: 'いただきます（Itadakimasu）是日式饮食文化中用餐前说的礼貌用语。', en: 'いただきます (Itadakimasu) is a polite expression said before eating in Japanese culture.' }
        },
        {
          q: { zh: '"さようなら" 的意思是？', en: 'What does "さようなら" mean?' },
          opts: { zh: ['欢迎光临', '再见', '早上好', '请多指教'], en: ['Welcome', 'Goodbye', 'Good morning', 'Nice to meet you'] },
          ans: 1,
          exp: { zh: 'さようなら（Sayounara）表示告别，即"再见"。', en: 'さようなら (Sayounara) means "Goodbye".' }
        },
        {
          q: { zh: '平假名 "いぬ" 指的是哪种动物？', en: 'What animal does the Hiragana "いぬ" refer to?' },
          opts: { zh: ['猫', '兔子', '狗', '熊'], en: ['Cat', 'Rabbit', 'Dog', 'Bear'] },
          ans: 2,
          exp: { zh: 'いぬ（Inu）汉字写作"犬"，即"狗"。', en: 'いぬ (Inu) is written as "犬" in Kanji, which means "Dog".' }
        },
        {
          q: { zh: '"おはようございます" 适用于哪个时间段？', en: 'When is "おはようございます" used?' },
          opts: { zh: ['早晨', '中午', '晚上', '睡前'], en: ['Morning', 'Afternoon', 'Evening', 'Before sleeping'] },
          ans: 0,
          exp: { zh: 'おはようございます（Ohayou gozaimasu）是早晨使用的礼貌问候语。', en: 'おはようございます (Ohayou gozaimasu) is a polite morning greeting ("Good morning").' }
        }
      ]
    },
    {
      id: 2,
      titleZh: '试卷2：指示代词与数字基础',
      titleEn: 'Paper 2: Demonstratives & Basic Numbers',
      questions: [
        {
          q: { zh: '日语数字 "三（さん）" 对应的发音是？', en: 'What is the Japanese pronunciation for the number "3 (三)"?' },
          opts: { zh: ['ichi', 'ni', 'san', 'yon'], en: ['ichi', 'ni', 'san', 'yon'] },
          ans: 2,
          exp: { zh: '1=いち, 2=に, 3=さん(san)。', en: '1=ichi, 2=ni, 3=san.' }
        },
        {
          q: { zh: '"これ" 指的是距离谁较近的事物？', en: 'What does "これ" refer to?' },
          opts: { zh: ['说话者（这个）', '听话者（那个）', '远处的第三方（那个远处的）', '不确定的事物'], en: ['Something close to the speaker (This)', 'Something close to the listener (That)', 'Something far from both (That over there)', 'An uncertain object'] },
          ans: 0,
          exp: { zh: 'これ（Kore）是指示代词，表示离说话人近的东西，"这个"。', en: 'これ (Kore) is a demonstrative pronoun meaning "this" (near the speaker).' }
        },
        {
          q: { zh: '"それは何（なん）ですか" 的中文意思是？', en: 'What does "それは何（なん）ですか" mean?' },
          opts: { zh: ['那个人是谁？', '那是什么？', '这个多少钱？', '你去哪里？'], en: ['Who is that person?', 'What is that?', 'How much is this?', 'Where are you going?'] },
          ans: 1,
          exp: { zh: 'それ（那个）+ は（助词）+ 何（什么）+ ですか（疑问语气）= 那是什么？', en: 'それ (that) + は (particle) + 何 (what) + ですか (question mark) = "What is that?"' }
        },
        {
          q: { zh: '片假名 "パン" 的意思是？', en: 'What does the Katakana "パン" mean?' },
          opts: { zh: ['米饭', '面包', '牛奶', '水果'], en: ['Rice', 'Bread', 'Milk', 'Fruit'] },
          ans: 1,
          exp: { zh: 'パン（Pan）源自葡萄牙语 pão，意为面包。', en: 'パン (Pan) comes from the Portuguese word "pão", meaning "Bread".' }
        },
        {
          q: { zh: '数字 "10" 在日语里的读音是？', en: 'How do you pronounce the number "10" in Japanese?' },
          opts: { zh: ['じゅう (Juu)', 'はち (Hachi)', 'なな (Nana)', 'ろく (Roku)'], en: ['じゅう (Juu)', 'はち (Hachi)', 'なな (Nana)', 'ろく (Roku)'] },
          ans: 0,
          exp: { zh: '10 在日语里读作 じゅう (Juu)。', en: 'The number 10 is pronounced as じゅう (Juu).' }
        },
        {
          q: { zh: '表示"远处的那个事物"应该用哪个词？', en: 'Which word refers to an object far from both the speaker and the listener?' },
          opts: { zh: ['これ', 'それ', 'あれ', 'どれ'], en: ['これ', 'それ', 'あれ', 'どれ'] },
          ans: 2,
          exp: { zh: 'あれ（Are）用于指代距离说话人和听话人都较远的事物（那个）。', en: 'あれ (Are) refers to an object far from both people ("that over there").' }
        },
        {
          q: { zh: '"水（みず）" 的意思是？', en: 'What does "水（みず）" mean?' },
          opts: { zh: ['茶', '果汁', '水', '酒'], en: ['Tea', 'Juice', 'Water', 'Alcohol'] },
          ans: 2,
          exp: { zh: '水（みず / Mizu）即为普通饮用水。', en: '水 (みず / Mizu) means "Water".' }
        },
        {
          q: { zh: '问句后缀 "〜か" 的作用是？', en: 'What is the function of the sentence-ending particle "〜か"?' },
          opts: { zh: ['表示感叹', '表示疑问', '表示肯定', '表示否定'], en: ['Express exclamations', 'Indicate a question', 'Express affirmation', 'Express negation'] },
          ans: 1,
          exp: { zh: '在句末加上助词"か"，相当于中文的"吗"，用于构成疑问句。', en: 'Adding "か" at the end of a sentence turns it into a question.' }
        },
        {
          q: { zh: '"はい" 在答句中表示什么意思？', en: 'What does "はい" mean in an answer?' },
          opts: { zh: ['不是 / 不', '是的 / 好的', '不知道', '也许'], en: ['No', 'Yes / Okay', "I don't know", 'Maybe'] },
          ans: 1,
          exp: { zh: 'はい（Hai）表示应答或肯定，意为"是的/好的"。', en: 'はい (Hai) is used to express agreement or affirmation ("Yes / Okay").' }
        },
        {
          q: { zh: '"いいえ" 的中文意思是？', en: 'What does "いいえ" mean?' },
          opts: { zh: ['是的', '不是 / 不', '请', '谢谢'], en: ['Yes', 'No', 'Please', 'Thank you'] },
          ans: 1,
          exp: { zh: 'いいえ（Iie）用于否定回答，意为"不/不是"。', en: 'いいえ (Iie) is used for negative responses ("No").' }
        }
      ]
    },
    {
      id: 3,
      titleZh: '试卷3：基础判断句与名词助词',
      titleEn: 'Paper 3: Basic Sentences & Noun Particles',
      questions: [
        {
          q: { zh: '"わたしは学生（がくせい）です" 的意思是？', en: 'What does "わたしは学生（がくせい）です" mean?' },
          opts: { zh: ['我是老师', '我是学生', '我是医生', '我是公司职员'], en: ['I am a teacher.', 'I am a student.', 'I am a doctor.', 'I am an office worker.'] },
          ans: 1,
          exp: { zh: 'わたし（我）+ は（提示主语）+ 学生（学生）+ です（是）= 我是学生。', en: 'わたし (I) + は (topic particle) + 学生 (student) + です (am/is/are) = "I am a student."' }
        },
        {
          q: { zh: '助词 "は" 作为主语提示助词时，实际发音是？', en: 'How is the particle "は" pronounced when used as a topic marker?' },
          opts: { zh: ['ha', 'wa', 'ba', 'ma'], en: ['ha', 'wa', 'ba', 'ma'] },
          ans: 1,
          exp: { zh: '假名"は"作为句中助词使用时，读作"wa"。', en: 'When "は" functions as a grammatical particle in a sentence, it is pronounced as "wa".' }
        },
        {
          q: { zh: '否定句 "〜ではありません" 表示什么意思？', en: 'What does the negative ending "〜ではありません" mean?' },
          opts: { zh: ['是……', '不是……', '有……', '去……'], en: ['Is...', 'Is not...', 'To have...', 'To go...'] },
          ans: 1,
          exp: { zh: 'ではありません（Dewa arimasen）是判断句 です 的礼貌否定形式，"不是……"。', en: 'ではありません (Dewa arimasen) is the polite negative form of です ("is not / am not").' }
        },
        {
          q: { zh: '"先生（せんせい）" 在日语中通常指什么职业？', en: 'What profession does "先生（せんせい）" usually refer to?' },
          opts: { zh: ['学生', '老师/医生', '司机', '厨师'], en: ['Student', 'Teacher / Doctor', 'Driver', 'Chef'] },
          ans: 1,
          exp: { zh: '先生（Sensei）在日语中用来尊称教师、医生、律师等专业人士。', en: '先生 (Sensei) is used as an honorific title for teachers, doctors, lawyers, and professionals.' }
        },
        {
          q: { zh: '"本（ほん）" 对应的中文含义是？', en: 'What does "本（ほん）" mean?' },
          opts: { zh: ['笔', '纸', '书', '包'], en: ['Pen', 'Paper', 'Book', 'Bag'] },
          ans: 2,
          exp: { zh: '本（ほん / Hon）意为"书本"。', en: '本 (ほん / Hon) means "Book".' }
        },
        {
          q: { zh: '助词 "の" 的主要功能相当于中文的？', en: 'What English word best corresponds to the particle "の"?' },
          opts: { zh: ['和', '在', '的', '被'], en: ['And', 'In / At', "'s / Of (Possessive)", 'By'] },
          ans: 2,
          exp: { zh: '助词"の"连接两个名词，表示所属或限定关系，相当于"的"（如：わたしの本 = 我的书）。', en: 'The particle "の" connects two nouns to show possession or relationship (e.g., わたしの本 = My book).' }
        },
        {
          q: { zh: '"わたしの本" 翻译成中文是？', en: 'How do you translate "わたしの本"?' },
          opts: { zh: ['他的书', '我的书', '你的书', '谁的书'], en: ['His book', 'My book', 'Your book', 'Whose book'] },
          ans: 1,
          exp: { zh: 'わたし（我）+ の（的）+ 本（书）= 我的书。', en: 'わたし (I) + の (possessive) + 本 (book) = "My book".' }
        },
        {
          q: { zh: '"日本人（にほんじん）" 的意思是？', en: 'What does "日本人（にほんじん）" mean?' },
          opts: { zh: ['日本语言', '日本文化', '日本人', '日本食品'], en: ['Japanese language', 'Japanese culture', 'Japanese person', 'Japanese food'] },
          ans: 2,
          exp: { zh: '国家名 + 人（じん）表示该国的人。', en: 'Country name + 人 (jin) refers to a person of that nationality.' }
        },
        {
          q: { zh: '片假名 "トイレ" 指什么地方？', en: 'What place does the Katakana "トイレ" refer to?' },
          opts: { zh: ['厨房', '卧室', '洗手间/厕所', '客厅'], en: ['Kitchen', 'Bedroom', 'Restroom / Toilet', 'Living room'] },
          ans: 2,
          exp: { zh: 'トイレ（Toire）源自英语 Toilet，意为洗手间。', en: 'トイレ (Toire) comes from the English word "Toilet".' }
        },
        {
          q: { zh: '"どなた" 或 "だれ" 用于询问什么？', en: 'What are "どなた" or "だれ" used to ask?' },
          opts: { zh: ['什么时候', '哪里', '谁', '为什么'], en: ['When', 'Where', 'Who', 'Why'] },
          ans: 2,
          exp: { zh: 'だれ / どなた（礼貌形）表示疑问代词"谁"。', en: 'だれ / どなた (polite) are question words meaning "Who".' }
        }
      ]
    },
    {
      id: 4,
      titleZh: '试卷4：场所、时间与简单动词',
      titleEn: 'Paper 4: Locations, Time & Simple Verbs',
      questions: [
        {
          q: { zh: '"ここ" 表示什么位置？', en: 'What location does "ここ" refer to?' },
          opts: { zh: ['这里', '那里', '哪里', '上面'], en: ['Here', 'There', 'Where', 'Above'] },
          ans: 0,
          exp: { zh: 'ここ（Koko）表示距离说话人近的地点，"这里"。', en: 'ここ (Koko) refers to the location near the speaker ("Here").' }
        },
        {
          q: { zh: '"どこですか" 是在询问什么？', en: 'What does "どこですか" ask?' },
          opts: { zh: ['是什么？', '是哪位？', '在哪里？', '多少钱？'], en: ['What is it?', 'Who is it?', 'Where is it?', 'How much is it?'] },
          ans: 2,
          exp: { zh: 'どこ（哪里）+ ですか（疑问）= 在哪里？', en: 'どこ (Where) + ですか (question mark) = "Where is it?"' }
        },
        {
          q: { zh: '"今（いま）" 的意思是？', en: 'What does "今（いま）" mean?' },
          opts: { zh: ['昨天', '现在', '明天', '上午'], en: ['Yesterday', 'Now', 'Tomorrow', 'Morning'] },
          ans: 1,
          exp: { zh: '今（いま / Ima）意为"现在"。', en: '今 (いま / Ima) means "Now".' }
        },
        {
          q: { zh: '表达"几点"的日语疑问词是？', en: 'Which question word means "What time"?' },
          opts: { zh: ['何時（なんじ）', '何日（なんにち）', '何人（なにじん）', '何歳（なんさい）'], en: ['何時（なんじ）', '何日（なんにち）', '何人（なにじん）', '何歳（なんさい）'] },
          ans: 0,
          exp: { zh: '何時（なんじ / Nan-ji）表示"几点钟"。', en: '何時 (なんじ / Nan-ji) means "What time".' }
        },
        {
          q: { zh: '动词 "行（い）きます" 的意思是？', en: 'What does the verb "行（い）きます" mean?' },
          opts: { zh: ['来', '去', '吃', '看'], en: ['To come', 'To go', 'To eat', 'To see'] },
          ans: 1,
          exp: { zh: '行きます（Ikimasu）意为"去"。', en: '行きます (Ikimasu) means "To go".' }
        },
        {
          q: { zh: '动词 "来（き）ます" 的意思是？', en: 'What does the verb "来（き）ます" mean?' },
          opts: { zh: ['去', '返回', '来', '走'], en: ['To go', 'To return', 'To come', 'To walk'] },
          ans: 2,
          exp: { zh: '来ます（Kimasu）意为"来"。', en: '来ます (Kimasu) means "To come".' }
        },
        {
          q: { zh: '"今日（きょう）" 表示什么时间？', en: 'What time frame does "今日（きょう）" refer to?' },
          opts: { zh: ['明天', '今天', '昨天', '每天'], en: ['Tomorrow', 'Today', 'Yesterday', 'Every day'] },
          ans: 1,
          exp: { zh: '今日（きょう / Kyou）意为"今天"。', en: '今日 (きょう / Kyou) means "Today".' }
        },
        {
          q: { zh: '"明日（あした）" 的意思是？', en: 'What does "明日（あした）" mean?' },
          opts: { zh: ['明天', '昨天', '后天', '大后天'], en: ['Tomorrow', 'Yesterday', 'Day after tomorrow', 'Two days after tomorrow'] },
          ans: 0,
          exp: { zh: '明日（あした / Ashita）意为"明天"。', en: '明日 (あした / Ashita) means "Tomorrow".' }
        },
        {
          q: { zh: '片假名 "レストラン" 是指什么场所？', en: 'What place does the Katakana "レストラン" refer to?' },
          opts: { zh: ['银行', '邮局', '餐厅', '医院'], en: ['Bank', 'Post office', 'Restaurant', 'Hospital'] },
          ans: 2,
          exp: { zh: 'レストラン（Resutoran）源自 Restaurant，意为餐厅。', en: 'レストラン (Resutoran) comes from the English word "Restaurant".' }
        },
        {
          q: { zh: '"いくらですか" 用于询问什么？', en: 'What is "いくらですか" used to ask?' },
          opts: { zh: ['时间', '年龄', '价格（多少钱）', '数量'], en: ['Time', 'Age', 'Price (How much)', 'Quantity'] },
          ans: 2,
          exp: { zh: 'いくら（Ikura）用于询问商品或服务的价格，意为"多少钱？"。', en: 'いくら (Ikura) is used to ask for the price of an item ("How much is it?").' }
        }
      ]
    },
    {
      id: 5,
      titleZh: '试卷5：日常活动与基础宾语',
      titleEn: 'Paper 5: Daily Activities & Direct Objects',
      questions: [
        {
          q: { zh: '动词 "食（た）べます" 的意思是？', en: 'What does the verb "食（た）べます" mean?' },
          opts: { zh: ['喝', '吃', '买', '做'], en: ['To drink', 'To eat', 'To buy', 'To do'] },
          ans: 1,
          exp: { zh: '食べます（Tabemasu）意为"吃"。', en: '食べます (Tabemasu) means "To eat".' }
        },
        {
          q: { zh: '"飲（の）みます" 表示什么动作？', en: 'What action does "飲（の）みます" express?' },
          opts: { zh: ['喝', '听', '读', '写'], en: ['To drink', 'To listen', 'To read', 'To write'] },
          ans: 0,
          exp: { zh: '飲みます（Nomimasu）意为"喝"。', en: '飲みます (Nomimasu) means "To drink".' }
        },
        {
          q: { zh: '助词 "を" 在句子中的作用是？', en: 'What is the function of the particle "を"?' },
          opts: { zh: ['提示主语', '提示动作的直接宾语', '表示时间点', '表示并列'], en: ['Mark the subject', 'Mark the direct object of an action', 'Indicate a specific time', 'Connect nouns (And)'] },
          ans: 1,
          exp: { zh: '助词"を"（读作 o）放在名词后，提示后续动词的作用对象（直接宾语）。', en: 'The particle "を" (pronounced "o") follows a noun to indicate the direct object of the verb.' }
        },
        {
          q: { zh: '"ご飯（はん）を食べます" 的意思是？', en: 'What does "ご飯（はん）を食べます" mean?' },
          opts: { zh: ['买米饭', '吃饭', '做饭', '卖饭'], en: ['Buy rice', 'Eat a meal / Eat rice', 'Cook rice', 'Sell food'] },
          ans: 1,
          exp: { zh: 'ご飯（饭）+ を（宾语助词）+ 食べます（吃）= 吃饭。', en: 'ご飯 (meal/rice) + を (object particle) + 食べます (eat) = "Eat a meal".' }
        },
        {
          q: { zh: '"水（みず）を飲みます" 翻译为？', en: 'How do you translate "水（みず）を飲みます"?' },
          opts: { zh: ['买水', '倒水', '喝水', '烧水'], en: ['Buy water', 'Pour water', 'Drink water', 'Boil water'] },
          ans: 2,
          exp: { zh: '水（水）+ を + 飲みます（喝）= 喝水。', en: '水 (water) + を + 飲みます (drink) = "Drink water".' }
        },
        {
          q: { zh: '动词 "見（み）ます" 的意思是？', en: 'What does the verb "見（み）ます" mean?' },
          opts: { zh: ['听', '看', '说', '想'], en: ['To listen', 'To see / To watch', 'To speak', 'To think'] },
          ans: 1,
          exp: { zh: '見ます（Mimasu）意为"看"（如看电视、看电影）。', en: '見ます (Mimasu) means "To see" or "To watch" (e.g., watching TV).' }
        },
        {
          q: { zh: '"買（か）います" 的意思是？', en: 'What does "買（か）います" mean?' },
          opts: { zh: ['卖', '借', '买', '送'], en: ['To sell', 'To borrow', 'To buy', 'To give'] },
          ans: 2,
          exp: { zh: '買います（Kaimasu）意为"购买"。', en: '買います (Kaimasu) means "To buy".' }
        },
        {
          q: { zh: '"新聞（しんぶん）" 在日语里是指？', en: 'What does "新聞（しんぶん）" mean in Japanese?' },
          opts: { zh: ['新闻广播', '报纸', '杂志', '信件'], en: ['Radio news', 'Newspaper', 'Magazine', 'Letter'] },
          ans: 1,
          exp: { zh: '新聞（しんぶん / Shinbun）在日语里的意思是"报纸"。', en: '新聞 (しんぶん / Shinbun) means "Newspaper".' }
        },
        {
          q: { zh: '"テレビを見ます" 的意思是？', en: 'What does "テレビを見ます" mean?' },
          opts: { zh: ['听广播', '看电视', '买电视', '修电视'], en: ['Listen to the radio', 'Watch television', 'Buy a TV', 'Repair a TV'] },
          ans: 1,
          exp: { zh: 'テレビ（电视）+ を + 見ます（看）= 看电视。', en: 'テレビ (TV) + を + 見ます (watch) = "Watch TV".' }
        },
        {
          q: { zh: '动词否定形式 "〜ません" 表示什么？', en: 'What does the verb ending "〜ません" express?' },
          opts: { zh: ['正在做……', '不做…… / 不会……', '想做……', '做了……'], en: ['Currently doing...', 'Do not... / Will not... (Negative form)', 'Want to do...', 'Did...'] },
          ans: 1,
          exp: { zh: '〜ません（masen）是动词 ます 形的礼貌否定式，表示不进行某种动作。', en: '〜ません (masen) is the polite negative form of verbs, indicating that an action is not/will not be performed.' }
        }
      ]
    }
  ];

  // ---------- 2. 状态 ----------
  let currentLang = 'zh';          // 'zh' 或 'en'
  let currentPaperId = null;       // 1-5
  let currentIndex = 0;            // 0-9
  let score = 0;
  let currentQuestionSolved = false;

  // ---------- 3. DOM 引用 ----------
  const quizBody = document.getElementById('quiz-body');
  const quizFeedback = document.getElementById('quiz-feedback');
  const quizIndexLabel = document.getElementById('quiz-index');
  const quizProgressBar = document.getElementById('quiz-progress-bar');
  const quizScoreLabel = document.getElementById('quiz-score');
  const nextBtn = document.getElementById('quiz-next-btn');

  // 如果缺少必要元素，则停止执行
  if (!quizBody || !quizFeedback || !quizIndexLabel || !quizProgressBar || !quizScoreLabel || !nextBtn) {
    console.error('quiz.js: 缺少必要的 DOM 元素，请确保存在以下 id: quiz-body, quiz-feedback, quiz-index, quiz-progress-bar, quiz-score, quiz-next-btn');
    return;
  }

  // ---------- 4. 工具函数 ----------
  function t(zh, en) {
    return currentLang === 'zh' ? zh : en;
  }

  function getPaperTitle(paperId) {
    const paper = PAPERS.find(p => p.id === paperId);
    if (!paper) return '';
    return t(paper.titleZh, paper.titleEn);
  }

  function getCurrentPaper() {
    return PAPERS.find(p => p.id === currentPaperId);
  }

  function getCurrentQuestion() {
    const paper = getCurrentPaper();
    if (!paper) return null;
    return paper.questions[currentIndex] || null;
  }

  function updateScoreDisplay() {
    if (quizScoreLabel) quizScoreLabel.textContent = score;
  }

  // ---------- 5. 创建语言切换按钮（如果不存在） ----------
  function ensureLangToggle() {
    // 查找是否存在 .lang-toggle 容器
    let toggle = document.querySelector('.lang-toggle');
    if (!toggle) {
      // 创建并插入到 .quiz-header 或 body 开头
      const header = document.querySelector('.quiz-header');
      toggle = document.createElement('div');
      toggle.className = 'lang-toggle';
      toggle.style.cssText = 'display:flex; background:#eef2f7; border-radius:40px; padding:3px; gap:2px;';
      const zhBtn = document.createElement('button');
      zhBtn.className = 'lang-btn active';
      zhBtn.dataset.lang = 'zh';
      zhBtn.textContent = '中文';
      zhBtn.style.cssText = 'border:none; background:transparent; padding:6px 18px; border-radius:30px; font-size:14px; font-weight:600; color:#6b7a8f; cursor:pointer; font-family:inherit;';
      const enBtn = document.createElement('button');
      enBtn.className = 'lang-btn';
      enBtn.dataset.lang = 'en';
      enBtn.textContent = 'English';
      enBtn.style.cssText = 'border:none; background:transparent; padding:6px 18px; border-radius:30px; font-size:14px; font-weight:600; color:#6b7a8f; cursor:pointer; font-family:inherit;';
      toggle.appendChild(zhBtn);
      toggle.appendChild(enBtn);

      // 设置 active 样式
      function setActive(lang) {
        toggle.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        toggle.querySelector(`.lang-btn[data-lang="${lang}"]`).classList.add('active');
      }
      setActive('zh');

      // 绑定事件
      toggle.addEventListener('click', function(e) {
        const btn = e.target.closest('.lang-btn');
        if (!btn) return;
        const lang = btn.dataset.lang;
        if (lang === currentLang) return;
        currentLang = lang;
        setActive(lang);
        // 刷新当前界面
        if (currentPaperId === null) {
          renderPaperSelection();
        } else {
          const paper = getCurrentPaper();
          if (!paper) { renderPaperSelection(); return; }
          const isResult = quizBody.querySelector('.quiz-result') !== null;
          if (isResult) {
            renderResult();
          } else {
            renderQuestion();
          }
        }
      });

      // 插入到 header 中，如果不存在则添加到 body 前
      if (header) {
        header.appendChild(toggle);
      } else {
        document.body.insertBefore(toggle, document.body.firstChild);
      }
    }
    // 更新按钮文字（如果已存在，确保文字正确）
    const btns = toggle.querySelectorAll('.lang-btn');
    btns.forEach(b => {
      if (b.dataset.lang === 'zh') b.textContent = '中文';
      else if (b.dataset.lang === 'en') b.textContent = 'English';
    });
  }

  // ---------- 6. 渲染：试卷选择 ----------
  function renderPaperSelection() {
    currentPaperId = null;
    currentIndex = 0;
    score = 0;
    currentQuestionSolved = false;
    updateScoreDisplay();

    quizFeedback.textContent = '';
    quizFeedback.className = 'quiz-feedback';
    nextBtn.style.display = 'none';
    quizProgressBar.style.width = '0%';
    quizIndexLabel.textContent = t('选择试卷开始', 'Select a paper to start');

    let html = `
      <div style="margin-bottom:12px; font-weight:600; color:#0b1c33; font-size:18px;">
        ${t('📚 请选择一份试卷', '📚 Please select a paper')}
      </div>
      <div class="paper-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px,1fr)); gap:16px;">
    `;

    PAPERS.forEach(p => {
      const title = t(p.titleZh, p.titleEn);
      html += `
        <div class="paper-card" data-paper-id="${p.id}" style="background:#fafcff; border:2px solid #e6ecf3; border-radius:20px; padding:18px 12px 16px; text-align:center; cursor:pointer; transition:all 0.2s; box-shadow:0 2px 6px rgba(0,0,0,0.02);">
          <span style="font-size:28px; font-weight:800; color:#2a6df4; display:block; margin-bottom:4px;">${p.id}</span>
          <div style="font-weight:600; color:#0b1c33; font-size:15px; line-height:1.4;">${title}</div>
          <div style="font-size:13px; color:#6b7a8f; margin-top:4px;">${t('10 道选择题', '10 MC questions')}</div>
        </div>
      `;
    });

    html += `</div>`;
    quizBody.innerHTML = html;

    // 绑定卡片点击事件
    document.querySelectorAll('.paper-card').forEach(card => {
      card.addEventListener('click', function() {
        const id = parseInt(this.dataset.paperId, 10);
        selectPaper(id);
      });
      // 悬浮效果
      card.addEventListener('mouseenter', function() {
        this.style.borderColor = '#b8c9e0';
        this.style.background = '#f2f6fd';
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 8px 24px rgba(0,20,40,0.08)';
      });
      card.addEventListener('mouseleave', function() {
        this.style.borderColor = '#e6ecf3';
        this.style.background = '#fafcff';
        this.style.transform = 'none';
        this.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)';
      });
    });
  }

  // ---------- 7. 选择试卷 ----------
  function selectPaper(paperId) {
    currentPaperId = paperId;
    currentIndex = 0;
    score = 0;
    currentQuestionSolved = false;
    updateScoreDisplay();
    renderQuestion();
  }

  // ---------- 8. 渲染题目 ----------
  function renderQuestion() {
    const paper = getCurrentPaper();
    if (!paper) {
      renderPaperSelection();
      return;
    }

    currentQuestionSolved = false;
    quizFeedback.textContent = '';
    quizFeedback.className = 'quiz-feedback';
    nextBtn.style.display = 'none';

    const q = getCurrentQuestion();
    if (!q) {
      renderPaperSelection();
      return;
    }

    const total = paper.questions.length;
    const paperTitle = t(paper.titleZh, paper.titleEn);
    quizIndexLabel.textContent = `${paperTitle} · ${t('第', 'Q')} ${currentIndex+1}/${total}`;
    quizProgressBar.style.width = ((currentIndex) / total) * 100 + '%';

    renderMultipleChoice(q);
  }

  // ---------- 9. 选择题渲染 ----------
  function renderMultipleChoice(q) {
    const letters = ['A', 'B', 'C', 'D'];
    const questionText = t(q.q.zh, q.q.en);
    const options = t(q.opts.zh, q.opts.en);

    quizBody.innerHTML = `
      <span style="display:inline-block; background:#eef2f7; padding:2px 16px; border-radius:20px; font-size:12px; font-weight:600; color:#2c3e5c; letter-spacing:0.3px; align-self:flex-start; margin-bottom:4px;">
        ${t('选择题', 'Multiple Choice')}
      </span>
      <div style="font-size:18px; font-weight:600; color:#0b1c33; line-height:1.6; padding:4px 0 2px;">${questionText}</div>
      <div style="display:flex; flex-direction:column; gap:10px; margin-top:2px;">
        ${options.map((opt, i) => `
          <button class="quiz-option" data-index="${i}" style="display:flex; align-items:center; gap:12px; padding:14px 18px; border:2px solid #e6ecf3; border-radius:16px; background:#fafcff; font-size:16px; font-weight:500; color:#0b1c33; cursor:pointer; transition:all 0.15s; text-align:left; font-family:inherit; line-height:1.4; width:100%;">
            <span style="display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:50%; background:#e6ecf3; font-size:13px; font-weight:700; color:#2c3e5c; flex-shrink:0; transition:0.15s;">${letters[i]}</span>
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

        const chosenIndex = parseInt(this.dataset.index, 10);
        const isCorrect = chosenIndex === q.ans;

        optionButtons.forEach((b) => b.disabled = true);

        if (isCorrect) {
          this.classList.add('correct');
          this.style.borderColor = '#1f8b4c';
          this.style.background = '#e6f7ee';
          this.style.color = '#0f5a31';
          this.querySelector('span').style.background = '#1f8b4c';
          this.querySelector('span').style.color = '#fff';
          score += 10;
          updateScoreDisplay();
          showFeedback(
            t('✅ 回答正确！ +10 分', '✅ Correct! +10 pts'),
            true,
            t(q.exp.zh, q.exp.en)
          );
        } else {
          this.classList.add('wrong');
          this.style.borderColor = '#d14c4c';
          this.style.background = '#fdeeec';
          this.style.color = '#9e2d2d';
          this.querySelector('span').style.background = '#d14c4c';
          this.querySelector('span').style.color = '#fff';
          // 高亮正确答案
          const correctBtn = optionButtons[q.ans];
          correctBtn.style.borderColor = '#1f8b4c';
          correctBtn.style.background = '#e6f7ee';
          correctBtn.style.color = '#0f5a31';
          correctBtn.querySelector('span').style.background = '#1f8b4c';
          correctBtn.querySelector('span').style.color = '#fff';
          const correctText = t(q.opts.zh, q.opts.en)[q.ans];
          showFeedback(
            t('❌ 答错了，正确答案是：', '❌ Wrong, correct answer is: ') + correctText,
            false,
            t(q.exp.zh, q.exp.en)
          );
        }

        nextBtn.style.display = 'inline-flex';
        nextBtn.textContent = (currentIndex === 9) ? t('完成试卷', 'Finish Paper') : t('下一题', 'Next');
      });

      // 悬浮样式
      btn.addEventListener('mouseenter', function() {
        if (!this.disabled) {
          this.style.borderColor = '#b8c9e0';
          this.style.background = '#f2f6fd';
        }
      });
      btn.addEventListener('mouseleave', function() {
        if (!this.disabled) {
          this.style.borderColor = '#e6ecf3';
          this.style.background = '#fafcff';
        }
      });
    });
  }

  // ---------- 10. 反馈 ----------
  function showFeedback(text, isOk, explanation) {
    quizFeedback.textContent = text;
    quizFeedback.className = 'quiz-feedback ' + (isOk ? 'ok' : 'bad');
    quizFeedback.style.borderLeft = isOk ? '4px solid #1f8b4c' : '4px solid #d14c4c';
    quizFeedback.style.background = isOk ? '#e6f7ee' : '#fdeeec';
    quizFeedback.style.color = isOk ? '#0f5a31' : '#9e2d2d';
    if (explanation) {
      const expl = document.createElement('div');
      expl.className = 'explanation';
      expl.style.fontWeight = '400';
      expl.style.fontSize = '14px';
      expl.style.opacity = '0.85';
      expl.style.marginTop = '6px';
      expl.style.paddingTop = '6px';
      expl.style.borderTop = '1px dashed rgba(0,0,0,0.08)';
      expl.innerHTML = '💡 <strong>' + t('解析：', 'Explanation: ') + '</strong>' + explanation;
      quizFeedback.appendChild(expl);
    }
  }

  // ---------- 11. 结果页 ----------
  function renderResult() {
    const paper = getCurrentPaper();
    if (!paper) return;

    const total = paper.questions.length;
    const maxScore = total * 10;
    quizProgressBar.style.width = '100%';
    quizFeedback.textContent = '';
    nextBtn.style.display = 'none';
    quizIndexLabel.textContent = t('🎉 完成！', '🎉 Completed!');

    let msg = '';
    if (score === maxScore) msg = t('🌟 太厉害了，满分通过！', '🌟 Perfect score! Excellent!');
    else if (score >= maxScore * 0.7) msg = t('💪 很不错，继续加油！', '💪 Great job! Keep it up!');
    else msg = t('📖 再练练，你一定能更好！', '📖 Practice more, you\'ll get better!');

    quizBody.innerHTML = `
      <div class="quiz-result" style="display:flex; flex-direction:column; align-items:center; text-align:center; padding:12px 0 8px;">
        <span style="display:inline-block; background:#eef2f7; padding:2px 16px; border-radius:20px; font-size:12px; font-weight:600; color:#2c3e5c; letter-spacing:0.3px; align-self:flex-start; margin-bottom:4px;">
          ${t('试卷完成', 'Paper Completed')}
        </span>
        <div style="font-size:18px; font-weight:600; color:#0b1c33; margin-top:6px;">${t('你的最终成绩', 'Your Final Score')}</div>
        <div style="font-size:56px; font-weight:800; color:#0b1c33; letter-spacing:-0.02em; margin:12px 0 4px;">${score} <span style="font-size:24px; font-weight:500; color:#6b7a8f;">/ ${maxScore}</span></div>
        <p style="color:#6b7a8f; margin-bottom:24px; font-size:16px;">${msg}</p>
        <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center;">
          <button class="btn btn-outline" id="retry-paper-btn" style="display:inline-flex; align-items:center; justify-content:center; padding:10px 28px; border:2px solid #dce4ef; border-radius:40px; font-size:15px; font-weight:600; font-family:inherit; cursor:pointer; transition:all 0.2s; background:transparent; color:#0b1c33; gap:6px;">🔄 ${t('重做此卷', 'Retry this paper')}</button>
          <button class="btn btn-secondary" id="back-to-papers-from-result" style="display:inline-flex; align-items:center; justify-content:center; padding:10px 28px; border:none; border-radius:40px; font-size:15px; font-weight:600; font-family:inherit; cursor:pointer; transition:all 0.2s; background:#eef2f7; color:#0b1c33; gap:6px;">📋 ${t('返回试卷列表', 'Back to papers')}</button>
        </div>
      </div>
    `;

    document.getElementById('retry-paper-btn').addEventListener('click', function() {
      score = 0;
      currentIndex = 0;
      currentQuestionSolved = false;
      updateScoreDisplay();
      renderQuestion();
    });

    document.getElementById('back-to-papers-from-result').addEventListener('click', function() {
      renderPaperSelection();
    });
  }

  // ---------- 12. 导航按钮 ----------
  nextBtn.addEventListener('click', function() {
    if (!currentQuestionSolved) return;
    const paper = getCurrentPaper();
    if (!paper) return;

    if (currentIndex + 1 < paper.questions.length) {
      currentIndex++;
      renderQuestion();
    } else {
      renderResult();
    }
  });

  // ---------- 13. 初始化 ----------
  function init() {
    ensureLangToggle();
    renderPaperSelection();
  }

  // 如果 DOM 已加载，直接初始化；否则等待
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
