/**
 * story.js —— AI 故事工坊 · 本地故事生成引擎
 *
 * 重要说明：
 * 这是一个纯前端静态网站，没有后端服务器，因此无法安全地调用
 * 需要密钥的大语言模型 API（密钥写在前端代码里任何人都能看到）。
 * 这里采用"模板库 + 词库 + 随机组合"的方式在浏览器本地生成故事：
 * 每种风格都有一套开场/发展/转折/结局的句式模板和专属词库，
 * 每次生成时随机挑选并把用户输入的关键词嵌入其中，
 * 因此每次点击"生成"都会得到不同的故事组合。
 *
 * 如果未来想接入真正的大模型（例如 Claude API）：
 * 只需要新增一个轻量后端（用于安全存放密钥并转发请求），
 * 然后把下面 generateStory() 函数的返回值，
 * 替换成对该后端接口的 fetch 请求结果即可，
 * 页面的 HTML/CSS 完全不需要改动。
 */

(function () {
  const keywordInput = document.getElementById("story-keyword");
  const genreGroup = document.getElementById("story-genre-group");
  const generateBtn = document.getElementById("story-generate-btn");
  const regenerateBtn = document.getElementById("story-regenerate-btn");
  const copyBtn = document.getElementById("story-copy-btn");
  const outputBox = document.getElementById("story-output");
  const titleEl = document.getElementById("story-title");
  const bodyEl = document.getElementById("story-body");

  if (!generateBtn) return; // 不是故事页面则不执行

  let currentGenre = "adventure";
  let lastKeyword = "";

  // ---------- 1. 各风格的词库与模板 ----------
  const GENRE_BANKS = {
    adventure: {
      label: "冒险",
      characters: ["少年探险家阿岩", "背包客小鹿", "老船长莫里", "地图收藏家艾米"],
      settings: ["云雾缭绕的山谷", "地图边缘的荒岛", "被藤蔓覆盖的古城遗迹", "一望无际的沙漠"],
      titles: ["{keyword}的远征", "寻找{keyword}的旅程", "通往{keyword}之路"],
      opening: [
        "{character}背起行囊，踏上了寻找{keyword}的旅程，前方是{setting}。",
        "传说中，只有勇敢的人才能在{setting}找到{keyword}，{character}决定亲自去看看。",
      ],
      development: [
        "一路上，{character}翻过陡峭的山岭，蹚过湍急的溪流，脚下的路越来越难走，但{keyword}的传说始终在心里发光。",
        "在{setting}深处，{character}遇到了一位神秘的向导，向导只说了一句话：“去吧，{keyword}会在你最不经意的地方出现”。",
      ],
      twist: [
        "就在快要放弃的时候，{character}发现{keyword}其实一直藏在最开始出发的地方，只是换了一副模样。",
        "一场突如其来的暴风雨困住了{character}，却也意外地让{keyword}的秘密浮出水面。",
      ],
      ending: [
        "带着{keyword},{character}踏上归途，这段旅程让{character}明白，真正的宝藏其实是沿途的勇气。",
        "{character}把{keyword}小心地收进行囊，望着{setting}的方向,心里已经开始盘算下一次的冒险。",
      ],
    },
    fantasy: {
      label: "奇幻",
      characters: ["精灵学徒莉娅", "会说话的猫头鹰博士", "沉睡千年的守塔人", "小巫师图图"],
      settings: ["漂浮在云端的城堡", "长满会发光蘑菇的森林", "藏在图书馆深处的秘密房间", "月光下的水晶湖"],
      titles: ["{keyword}的魔法", "{keyword}与月光森林", "关于{keyword}的古老咒语"],
      opening: [
        "在{setting}里，流传着一个关于{keyword}的古老咒语，{character}无意间发现了它。",
        "每当夜幕降临,{setting}就会苏醒过来,{character}悄悄许下心愿,想要拥有{keyword}的力量。",
      ],
      development: [
        "{character}翻开泛黄的魔法书，一页一页地寻找线索，书页间飘出的微光渐渐拼出了{keyword}的轮廓。",
        "为了唤醒{keyword},{character}必须收集三样东西：一片会唱歌的叶子、一滴凝固的月光，还有一句真心话。",
      ],
      twist: [
        "没想到{keyword}并不是想象中的模样，它其实是一直陪在{character}身边、从未被留意过的小小存在。",
        "咒语念到一半，{setting}突然亮起了从未见过的光，{keyword}竟然自己开口说话了。",
      ],
      ending: [
        "从那以后，{character}和{keyword}成了形影不离的伙伴，一起守护着{setting}的宁静。",
        "{character}终于明白，真正的魔法不在{keyword}本身，而在于愿意相信奇迹的那颗心。",
      ],
    },
    scifi: {
      label: "科幻",
      characters: ["星际工程师诺娃", "小机器人 Z-7", "时间旅行者陆时", "星舰见习生小北"],
      settings: ["漂浮在土星环附近的空间站", "被数据洪流淹没的虚拟城市", "重力异常的第九号星球", "地球最后一座气候穹顶城市"],
      titles: ["{keyword}协议", "来自未来的{keyword}", "{keyword}：最后的信号"],
      opening: [
        "在{setting},一段来自深空的信号突然被截获,信号里反复出现同一个词——{keyword}。",
        "{character}正在{setting}执行例行任务，直到系统弹出一条从未见过的警告：检测到{keyword}。",
      ],
      development: [
        "{character}顺着信号的方向一路追踪，穿过废弃的太空站与沉默的卫星群，{keyword}的谜团越来越清晰。",
        "为了破解{keyword}背后的秘密，{character}不得不重启一台封存多年的旧型号计算机，屏幕上缓缓浮现出关键的代码。",
      ],
      twist: [
        "真相令人震惊：{keyword}竟然是很多年前人类自己留下的讯息，只是被时间和误解掩埋了。",
        "就在{character}以为一切结束时,{setting}的警报再次响起——{keyword}其实才刚刚开始。",
      ],
      ending: [
        "{character}把关于{keyword}的记录发送回地球，为后来者留下了一条清晰的路。",
        "带着对{keyword}全新的理解,{character}驾驶飞船驶向更远的星域,那里还有无数未解之谜等待被发现。",
      ],
    },
    comedy: {
      label: "幽默",
      characters: ["爱睡懒觉的发明家胖橘", "总是迟到的快递员阿贵", "自称“天才”的仓鼠先生", "手忙脚乱的实习魔法师小美"],
      settings: ["永远排队的甜甜圈店", "住着会打嗝的机器人的公寓", "周末总是停电的社区活动中心", "养满会跳舞的植物的阳台"],
      titles: ["{keyword}闯的祸", "关于{keyword}的一场乌龙", "{keyword}，别闹了！"],
      opening: [
        "这天一大早，{character}在{setting}醒来，发现{keyword}不知怎么就出现在了自己的枕头边。",
        "谁也没想到，一场关于{keyword}的乌龙，会在{setting}闹出这么大的动静。",
      ],
      development: [
        "{character}越想把{keyword}藏起来，它就越是不听话，一会儿滚到桌子底下，一会儿又蹦上了书架。",
        "为了搞定{keyword},{character}想出了三个“绝妙”的计划，结果一个比一个更手忙脚乱。",
      ],
      twist: [
        "正当{character}以为彻底失控的时候，邻居们全都探出头来，笑着说：“原来{keyword}一直是这么可爱的呀”。",
        "一顿兵荒马乱之后，大家才发现，{keyword}其实从头到尾都没干什么坏事，全是一场误会。",
      ],
      ending: [
        "从此,{setting}里多了一位新成员——{keyword}，{character}也终于学会了笑着面对突发状况。",
        "{character}把这次乌龙写成了日记,末尾加了一句：“和{keyword}在一起的日子，永远不会无聊”。",
      ],
    },
  };

  // 当用户没有输入关键词时，随机使用的默认词
  const FALLBACK_KEYWORDS = ["流星", "勇气", "秘密", "友谊", "彩虹", "时间"];

  // ---------- 2. 风格切换 ----------
  genreGroup.querySelectorAll(".story-genre-chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      genreGroup.querySelectorAll(".story-genre-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentGenre = chip.getAttribute("data-genre");
    });
  });

  // ---------- 3. 工具函数：从数组中随机取一项 ----------
  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ---------- 4. 工具函数：把模板中的占位符替换成真实内容 ----------
  function fillTemplate(template, vars) {
    return template
      .replace(/{keyword}/g, vars.keyword)
      .replace(/{character}/g, vars.character)
      .replace(/{setting}/g, vars.setting);
  }

  // ---------- 5. 核心：生成一篇故事 ----------
  function generateStory(keyword, genreKey) {
    const bank = GENRE_BANKS[genreKey];
    const finalKeyword = keyword && keyword.trim() ? keyword.trim() : pickRandom(FALLBACK_KEYWORDS);

    const vars = {
      keyword: finalKeyword,
      character: pickRandom(bank.characters),
      setting: pickRandom(bank.settings),
    };

    const title = fillTemplate(pickRandom(bank.titles), vars);
    const paragraphs = [
      fillTemplate(pickRandom(bank.opening), vars),
      fillTemplate(pickRandom(bank.development), vars),
      fillTemplate(pickRandom(bank.twist), vars),
      fillTemplate(pickRandom(bank.ending), vars),
    ];

    return { title, paragraphs };
  }

  // ---------- 6. 渲染故事到页面 ----------
  function renderStory(story) {
    titleEl.textContent = "《" + story.title + "》";
    bodyEl.innerHTML = story.paragraphs.map((p) => "<p>" + p + "</p>").join("");
    outputBox.classList.add("show");
    outputBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // ---------- 7. 按钮事件 ----------
  generateBtn.addEventListener("click", function () {
    lastKeyword = keywordInput.value;
    const story = generateStory(lastKeyword, currentGenre);
    renderStory(story);
  });

  regenerateBtn.addEventListener("click", function () {
    const story = generateStory(lastKeyword, currentGenre);
    renderStory(story);
  });

  copyBtn.addEventListener("click", function () {
    const fullText = titleEl.textContent + "\n\n" + bodyEl.innerText;
    navigator.clipboard
      .writeText(fullText)
      .then(function () {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "✅ 已复制";
        setTimeout(function () {
          copyBtn.textContent = originalText;
        }, 1500);
      })
      .catch(function () {
        alert("复制失败，请手动选中文字复制。");
      });
  });

  // 支持回车键快速生成
  keywordInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      generateBtn.click();
    }
  });
})();
