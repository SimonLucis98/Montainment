<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#193d38">
  <title>Zombie Spell Defense · Fruit World</title>
  <style>
:root{font-family: ui-rounded,"Trebuchet MS",Arial,sans-serif;color:#203f38;background:#163d36;font-synthesis:none}*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:radial-gradient(ellipse at 50% 20%,#42644c,#163d36 75%);padding:20px}button{font:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}button:focus-visible{outline:4px solid #ff9f24;outline-offset:4px}button:disabled{cursor:default}button:active{translate:0 3px}.game{width:min(1280px,100%);height:min(850px,calc(100dvh - 40px));min-height:650px;position:relative;overflow:hidden;border-radius:25px;background:#eaf0d8;box-shadow:0 24px 80px #092c3690;border:6px solid #ffffff19;isolation:isolate}.hud{height:85px;display:flex;align-items:center;gap:30px;padding:0 30px;background:#fff9e8;position:relative;z-index:4;border-bottom:3px solid #385b3520}.brand{display:flex;align-items:center;gap:10px;font-size:17px;font-weight:900;letter-spacing:.5px}.brand-icon{display:grid;place-items:center;background:#38634c;color:#fbd166;width:43px;height:46px;border-radius:13px;font-size:35px;box-shadow:0 4px #254536}.hud small{display:block;font-size:10px;font-weight:800;letter-spacing:1.8px;margin-bottom:6px;color:#6a7962}.brand small{font-size:9px;margin:5px 0 0}.wave-info{margin:auto;text-align:center}.wave-dots{display:flex;justify-content:center;gap:7px}.wave-dots i{height:7px;width:23px;background:#dce2cf;border-radius:5px}.wave-dots i.active{background:#80ac50}.score strong{font-size:26px}.health strong{font-size:25px;letter-spacing:3px;color:#ef7965}.sound{height:45px;width:45px;border:2px solid #dce2cf;border-radius:14px;background:#fffdf3;font-size:26px;color:#466b4d}.battlefield{height:calc(100% - 337px);min-height:310px;position:relative;overflow:hidden;background:linear-gradient(#bedbbb 0%,#d6e8bf 22%,#99c878 23%,#acd67e 64%,#b5d98a)}.sun{position:absolute;right:17%;top:-28px;width:92px;height:92px;border-radius:50%;background:#fff0a588;box-shadow:0 0 60px #fff8a0}.hills{position:absolute;top:2%;width:70%;height:130px;background:#82b884;border-radius:50% 60% 0 0}.hill-one{left:-20%;transform:rotate(5deg)}.hill-two{right:-25%;top:1%;background:#95c091}.road{position:absolute;inset:20% 20% -10%;background:linear-gradient(#d3bb87,#e9d3a0);clip-path:polygon(41% 0,59% 0,94% 100%,6% 100%)}.road-dashes{position:absolute;left:49.8%;top:30%;height:58%;border-left:3px dashed #c4ab7480}.garden-sign{position:absolute;left:10%;top:23%;display:flex;align-items:center;gap:10px;padding:10px 15px;background:#fff1bd;border:5px solid #ad8050;border-radius:8px;transform:rotate(-7deg);font-size:25px;box-shadow:0 6px #69934b40}.garden-sign:after{content:"";position:absolute;top:100%;left:50%;height:44px;width:9px;background:#ad8050}.garden-sign span{font-size:12px;font-weight:900;letter-spacing:1px}.tree{position:absolute;width:26px;height:125px;background:linear-gradient(90deg,#986c43,#b88a51);border-radius:10px;top:21%}.tree-left{left:4%;transform:rotate(-6deg)}.tree-right{right:8%;transform:scale(.9)}.tree>div{position:absolute;width:100px;height:109px;border-radius:44% 56% 40% 40%;background:radial-gradient(circle at 30% 20%,#b4d96b,#568c4d);left:-38px;top:-65px;box-shadow:inset -12px -9px #47774530,0 9px #517b4220;font-size:29px;padding:25px}.fence{position:absolute;top:57%;width:17%;height:50px;background:repeating-linear-gradient(90deg,transparent 0 16px,#f7e6b5 16px 26px,transparent 26px 42px);border-bottom:8px solid #e2cc97;transform:rotate(6deg);filter:drop-shadow(0 5px 0 #567b3820)}.fence:after{content:"";position:absolute;top:13px;width:100%;height:8px;background:#f7e6b5}.fence-left{left:8%}.fence-right{right:7%;transform:rotate(-6deg)}.patch{position:absolute;font-size:30px;color:#ffefbd;bottom:10%;letter-spacing:14px;transform:rotate(-8deg);text-shadow:0 3px #74a256}.patch span{color:#efaa99}.patch-left{left:6%}.patch-right{right:4%}.crate{position:absolute;bottom:22%;font-size:27px;border:6px solid #bb8651;border-bottom:14px solid #bb8651;background:#906e43;border-radius:4px;box-shadow:0 7px #6c914f40}.crate-left{left:24%;transform:rotate(-8deg)}.crate-right{right:22%;transform:rotate(8deg)}.pebble{position:absolute;width:18px;height:9px;border-radius:50%;background:#b3a47e;box-shadow:inset 0 3px #d3c299}.p1{left:41%;bottom:35%}.p2{right:40%;top:48%;scale:.6}.p3{left:34%;bottom:8%;scale:1.3}.combo{position:absolute;left:25px;top:22px;font-size:12px;font-weight:900;letter-spacing:1.3px;background:#fff9e8b0;padding:10px 14px;border-radius:20px;color:#4b714a}.boss-health{position:absolute;right:24px;top:23px;color:#90365d;background:#fff3e6;border-radius:15px;padding:9px 15px;font-weight:900;z-index:3}.danger-line{position:absolute;bottom:20%;left:32%;width:36%;border-top:2px dashed #b69d6990;text-align:center}.danger-line span{position:absolute;top:8px;left:0;font-size:8px;letter-spacing:1.3px;color:#967e52;font-weight:bold}.enemy{position:absolute;left:50%;top:0;width:100px;height:130px;margin-left:-50px;z-index:2;will-change:transform}.thought{position:absolute;left:76px;top:-34px;width:85px;height:76px;background:#fffdf3;border:3px solid #e5ead9;border-radius:28px;display:grid;place-items:center;font-size:53px;box-shadow:0 6px 0 #476c4020;transform:rotate(5deg)}.thought:before,.thought:after{content:"";position:absolute;border-radius:50%;background:#fffdf3}.thought:before{width:17px;height:17px;left:0;bottom:-14px}.thought:after{width:9px;height:9px;left:-8px;bottom:-24px}.zombie{position:absolute;inset:0;animation:wobble 1.4s ease-in-out infinite;transform-origin:50% 95%}.shadow{position:absolute;bottom:-2px;left:5px;width:91px;height:17px;background:#385b4235;border-radius:50%;filter:blur(2px)}.head{position:absolute;left:14px;top:1px;width:74px;height:66px;border-radius:25px 29px 22px 24px;background:radial-gradient(circle at 25% 20%,#c8e586,#8cc666 60%,#68a55b);box-shadow:inset -5px -5px #548c4935,0 4px #42613d40;border:2px solid #6b9c55;animation:head-rock 1.8s ease-in-out infinite;z-index:3}.eye{position:absolute;top:20px;width:23px;height:26px;border-radius:50%;background:#fffef0;border:2px solid #739754;box-shadow:0 3px #6c9c5140}.eye.left{left:7px;transform:rotate(8deg)}.eye.right{right:6px;top:17px}.eye:after{content:"";position:absolute;width:8px;height:10px;left:7px;bottom:5px;background:#2d4140;border-radius:50%;box-shadow:inset 2px 2px #5e6f61}.mouth{position:absolute;bottom:7px;left:25px;width:28px;height:11px;border-radius:4px 4px 12px 12px;background:#3d6650;transform:rotate(-8deg)}.mouth:after{content:"";position:absolute;left:6px;top:0;width:8px;height:6px;background:#fff8d9;border-radius:0 0 2px 2px}.nose{position:absolute;top:40px;left:35px;width:10px;height:7px;border-radius:50%;background:#83b45e}.ear{position:absolute;top:25px;width:10px;height:17px;background:#94c76a;border:2px solid #6b9c55;border-radius:8px;z-index:-1}.ear.left{left:-9px}.ear.right{right:-9px}.stitch{position:absolute;top:3px;left:15px;font-size:10px;color:#729651;transform:rotate(-12deg)}.hair{position:absolute;top:-7px;left:42px;width:6px;height:12px;background:#486c4c;transform:rotate(22deg);border-radius:5px;box-shadow:8px 2px #486c4c}.body{position:absolute;left:24px;top:59px;width:55px;height:44px;border-radius:16px 16px 9px 9px;background:linear-gradient(120deg,#9d96d0,#7564a7);box-shadow:inset -7px -4px #544c7a50;z-index:2}.body i{position:absolute;top:4px;left:20px;width:14px;height:25px;background:#d9af74;clip-path:polygon(10% 0,90% 0,60% 28%,100% 85%,50% 100%,0 85%,40% 28%)}.arm{position:absolute;top:61px;width:18px;height:46px;background:linear-gradient(90deg,#acd67c,#77af62);border-radius:12px;transform-origin:50% 9px;box-shadow:inset -4px -3px #568b4730;animation:arm-swing 1.4s ease-in-out infinite}.arm:before{content:"";position:absolute;top:0;width:100%;height:19px;background:#8b7bbb;border-radius:10px 10px 3px 3px}.arm.left{left:10px;rotate:14deg}.arm.right{right:7px;rotate:-17deg;animation-delay:-.7s}.leg{position:absolute;top:97px;width:20px;height:29px;background:#465c60;border-radius:4px 4px 9px 9px;animation:shuffle 1.4s ease-in-out infinite}.leg:after{content:"";position:absolute;bottom:-2px;width:27px;height:12px;left:-4px;border-radius:9px 6px 5px 5px;background:#34494c;border-bottom:3px solid #263d3b}.leg.left{left:26px}.leg.right{left:56px;animation-delay:-.7s}.enemy.boss .zombie{scale:1.5;transform-origin:50% 100%}.enemy.boss .thought{left:104px;top:-92px}.enemy.boss .body{background:linear-gradient(120deg,#e39485,#ac617f)}.enemy.dying .zombie{animation:die .55s ease-in forwards}.enemy.hit .zombie{animation:hit .45s ease-out}.base{position:absolute;bottom:0;left:50%;width:138px;height:110px;transform:translateX(-50%);z-index:3}.base-shadow{position:absolute;bottom:2px;left:-19px;width:178px;height:22px;background:#52674335;border-radius:50%;z-index:-1}.fort{position:absolute;bottom:4px;left:6px;width:126px;height:61px;background:linear-gradient(110deg,#e8d9b4,#bdac83);border:3px solid #a39373;border-radius:7px 7px 16px 16px;box-shadow:inset -8px -7px #b19c7440,0 5px #61714940;text-align:center}.fort i{position:absolute;width:29px;height:20px;background:#e8d9b4;top:-15px;border:3px solid #a39373;border-bottom:0;border-radius:4px 4px 0 0}.fort i:nth-child(1){left:-3px}.fort i:nth-child(2){left:44px}.fort i:nth-child(3){right:-3px}.fort span{position:absolute;bottom:5px;left:43px;font-size:28px;color:#7e8a64}.turret{position:absolute;width:76px;height:79px;left:32px;top:-5px;z-index:2;animation:idle 3s ease-in-out infinite}.turret-dome{position:absolute;bottom:0;width:76px;height:42px;background:linear-gradient(110deg,#648c79,#365e53);border-radius:45px 45px 13px 13px;border:3px solid #2e5349;box-shadow:inset 5px 4px #85a38a,0 5px #263f4130}.barrel{position:absolute;left:24px;top:0;width:29px;height:58px;background:linear-gradient(90deg,#34574f,#86a390 40%,#496f60 80%);border:3px solid #294d44;border-radius:8px 8px 3px 3px}.barrel:before{content:"";position:absolute;left:-5px;top:-3px;width:33px;height:13px;border:4px solid #44685c;background:#223f38;border-radius:6px}.muzzle{position:absolute;top:-32px;left:-12px;width:47px;height:45px;background:#ffed8d;clip-path:polygon(50% 0,63% 30%,95% 10%,77% 54%,100% 72%,61% 78%,50% 100%,30% 76%,0 68%,23% 45%,8% 8%,39% 30%);opacity:0}.shoot{animation:recoil .25s!important}.shoot .muzzle{animation:flash .25s}.feedback{position:absolute;left:50%;top:39%;translate:-50% -50%;z-index:7;font-size:34px;font-weight:1000;color:#fffbea;text-align:center;text-shadow:0 3px #396342,2px 0 #396342,-2px 0 #396342;pointer-events:none;white-space:nowrap}.feedback.wrong{font-size:74px;color:#e85c51;text-shadow:0 4px #fff7e5}.effects{position:absolute;inset:0;pointer-events:none;z-index:6}.projectile{position:absolute;width:19px;height:25px;background:#fff5a1;border-radius:50%;box-shadow:0 0 12px 5px #ffc447,0 17px 12px #ffa62caa}.projectile.fire-shot{background:#fff0a2;box-shadow:0 0 20px 8px #ff7747}.projectile.rocket-shot{width:26px;height:40px;background:#f79264;box-shadow:0 20px 12px #ffca37}.projectile.lightning-shot{background:white;box-shadow:0 0 22px 12px #b5a4ff}.particle{position:absolute;width:12px;height:12px;border-radius:4px;background:var(--color);animation:burst .6s ease-out forwards}.float-score{position:absolute;color:#fffdf2;font-size:27px;font-weight:900;text-shadow:0 2px #466447;animation:float-up .9s ease-out forwards;white-space:nowrap}.controls{height:252px;background:#fff9e8;position:relative;z-index:5;padding:16px 30px 12px;border-top:5px solid #dce5bf}.control-top{display:flex;align-items:center;justify-content:space-between;color:#71816b;font-size:12px;gap:8px}.eyebrow{letter-spacing:1.7px;font-size:10px;font-weight:900;color:#5e7755}#hint{font-weight:700;color:#527447}#wordCount{font-size:10px;letter-spacing:1px}.slots{display:flex;gap:8px;justify-content:center;margin:15px auto 16px}.slot,.tile{height:57px;width:55px;display:grid;place-items:center;font-size:29px;font-weight:900;border-radius:12px;flex-shrink:0;user-select:none;touch-action:none}.slot{border:2px dashed #b9c6a7;background:#ecf0dc;color:#476247;position:relative}.slot:empty:after{content:"";position:absolute;bottom:12px;width:15px;height:3px;border-radius:3px;background:#b4c19f}.slot.locked{background:#dfe9cb;border:2px solid #d3dfbd;box-shadow:0 4px #c9d5b4;color:#526c43}.slot.filled{background:#ffe49b;border:2px solid #d7ae5c;box-shadow:0 4px #d5b36c;color:#4f5334}.slot.target{background:#f6eabb;border:3px solid #e6a945;transform:translateY(-3px)}.slot.good{background:#c7e6a2}.slot.bad{background:#ffd7c5;border-color:#df7765;animation:shake .35s}.tray-row{display:flex;align-items:center;gap:22px;justify-content:center}.tray-label{font-size:9px;letter-spacing:1.5px;color:#899378;line-height:1.6;position:relative}.tray-label span{position:absolute;right:-19px;top:4px;font-size:25px;color:#b2bca2}.tray{display:flex;gap:9px;justify-content:center;min-width:220px;min-height:58px}.tile{border:2px solid #d9b967;background:linear-gradient(#ffeeb4,#f7d681);box-shadow:0 5px #c8a453,0 7px 5px #8f7d3420;color:#475138;cursor:grab;transition:transform .12s}.tile:hover{transform:translateY(-3px)}.tile.selected{outline:3px solid #e89536;transform:translateY(-4px)}.tile.used{visibility:hidden;pointer-events:none}.tile.tutorial{animation:tile-bounce 1.5s infinite}.drag-ghost{position:fixed;pointer-events:none;z-index:1000;transform:scale(1.12) rotate(-5deg);box-shadow:0 12px 25px #213e3850;opacity:.96}.fire,.play{border:2px solid #b85a36;border-radius:15px;background:linear-gradient(#faac61,#ee8851);box-shadow:0 6px #b9653d,0 8px 10px #78513920;color:#fff9dc;font-weight:1000;letter-spacing:1.5px;text-shadow:0 2px #ad603c;font-size:25px;height:60px;padding:0 34px}.fire span,.play span{margin-left:17px}.fire:disabled{filter:saturate(.5);opacity:.65}.fire.ready{animation:tile-bounce 1.5s infinite}.control-footer{display:flex;justify-content:space-between;margin-top:17px;color:#929980;font-size:10px}.overlay{position:absolute;inset:85px 0 0;z-index:10;background:linear-gradient(90deg,#173c378f,#224d3b30);backdrop-filter:blur(4px);display:grid;place-items:center}.overlay[hidden],.enemy[hidden],.boss-health[hidden]{display:none}.start-card{text-align:center;background:#fff9eaf5;border:2px solid #fffdf1;border-radius:27px;padding:27px 55px 25px;box-shadow:0 15px 0 #244f3430,0 25px 60px #254b3950;max-width:90%;position:relative}.world-tag{display:inline-block;background:#e3edcc;color:#567643;border-radius:30px;padding:9px 20px;font-weight:900;font-size:12px;letter-spacing:1.5px}.title-kicker{font-size:9px;letter-spacing:2px;color:#8c967d;font-weight:bold;margin-top:22px}h1{font-size:63px;line-height:.99;letter-spacing:-2px;margin:15px 0;color:#3c624a;text-shadow:0 4px #d8e3bd}h1 span{font-size:35px;letter-spacing:-1px;color:#e58b51;text-shadow:0 3px #f4d6a2}.start-card p{font-size:18px;line-height:1.45;color:#758069;margin:15px 0 22px}.play{min-width:225px}.start-notes{display:flex;justify-content:center;gap:24px;font-size:11px;color:#8c967c;margin-top:26px}.result-title{font-size:43px;line-height:1.1}.stars{font-size:36px;margin-top:15px}.stats{display:grid;grid-template-columns:1fr 1fr;gap:13px 30px;margin:23px 0;text-align:left}.stats div{font-size:11px;color:#78846a;background:#edf0da;padding:12px 17px;border-radius:12px}.stats strong{display:block;font-size:24px;color:#3f6248;margin-top:5px}.rotate{display:none}.shaking{animation:shake .3s}.tiny-shake{animation:shake .15s}.pop{animation:tile-bounce .35s}
@keyframes wobble{0%,100%{transform:rotate(-3deg) translateY(0)}50%{transform:rotate(3deg) translateY(-3px)}}@keyframes head-rock{0%,100%{rotate:3deg}50%{rotate:-3deg}}@keyframes arm-swing{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(12deg)}}@keyframes shuffle{0%,100%{transform:translateY(-2px) rotate(4deg)}50%{transform:translateY(2px) rotate(-4deg)}}@keyframes idle{50%{transform:translateY(-2px)}}@keyframes recoil{40%{transform:translateY(9px)}}@keyframes flash{0%,70%{opacity:1}100%{opacity:0}}@keyframes die{20%{transform:translateY(-13px) rotate(-12deg)}100%{transform:translateY(-40px) rotate(75deg) scale(.1);opacity:0}}@keyframes hit{30%{transform:translateY(-20px) rotate(-12deg)}100%{transform:none}}@keyframes shake{25%{translate:-5px 0}75%{translate:5px 0}}@keyframes tile-bounce{0%,100%{translate:0 0}50%{translate:0 -5px}}@keyframes burst{to{transform:translate(var(--dx),var(--dy)) rotate(160deg);opacity:0}}@keyframes float-up{to{translate:0 -60px;opacity:0}}
@media(max-width:1000px){body{padding:10px}.game{height:calc(100dvh - 20px);min-height:610px}.hud{gap:18px;padding:0 20px}.brand{font-size:13px}.brand small{font-size:8px}.controls{padding-left:18px;padding-right:18px}.tray-row{gap:16px}.tray-label{display:none}.tile,.slot{width:50px;height:54px}.tray{gap:6px;min-width:180px}.fire{padding:0 23px}.garden-sign{left:9%;scale:.85}.crate-left{left:20%}.crate-right{right:17%}}
@media(max-height:700px) and (min-width:650px){body{padding:0}.game{height:100dvh;min-height:520px;border-radius:0;border-width:0}.hud{height:65px}.battlefield{height:calc(100% - 285px);min-height:235px}.controls{height:220px;padding-top:10px}.slots{margin:11px auto 12px}.slot,.tile{height:50px;width:49px;font-size:26px}.control-footer{margin-top:10px}.overlay{top:65px}.start-card{padding:18px 45px}h1{font-size:47px}h1 span{font-size:29px}.start-card p{margin:10px 0 15px}.title-kicker{margin-top:15px}.start-notes{margin-top:18px}.tree{scale:.8}.base{scale:.8;transform-origin:50% 100%;margin-left:-14px}.fire{height:54px}.stats{margin:15px 0;gap:8px}}
@media(max-width:650px) and (orientation:portrait){.game{display:none}.rotate{display:flex;flex-direction:column;align-items:center;text-align:center;color:#fff5d7;max-width:290px}.rotate>span{font-size:90px;color:#f1bc6b}.rotate strong{font-size:27px}.rotate p{line-height:1.6;color:#c2d4b6}}
@media(max-height:519px) and (min-width:650px){.game{zoom:var(--compact-scale,1);width:calc(100vw / var(--compact-scale,1));height:520px;min-height:520px}}
.slots{gap:clamp(4px,.65vw,8px)}.slot{width:clamp(38px,4.6vw,55px)}.slot.word-space{width:16px;background:transparent;border:0;box-shadow:none}.slot.word-space:after{display:none}.tray{min-width:0}.thought:has(.fruit-art){height:90px;width:96px;display:flex;flex-direction:column;justify-content:center;gap:3px}.thought small{font:700 13px Arial,sans-serif;color:#526c43}.fruit-art{position:relative;flex-shrink:0;width:52px;height:51px;border-radius:48%;box-shadow:inset -5px -4px #0002}.dragon{background:radial-gradient(ellipse at 40% 40%,#ff92b8,#e64184 75%);border:3px solid #ca3875;transform:rotate(-12deg)}.dragon:before{content:'';position:absolute;inset:-6px;background:#91bd55;clip-path:polygon(45% 0,55% 24%,90% 10%,77% 39%,100% 53%,77% 61%,80% 94%,54% 76%,23% 100%,28% 68%,0 49%,23% 33%,16% 4%,40% 24%)}.dragon:after{content:'';position:absolute;inset:9px;border-radius:50%;background:radial-gradient(#463545 1px,transparent 2px) 0 0/8px 8px,#fff3ed}.passion{background:#793f79;border:4px solid #65335e}.passion:after{content:'';position:absolute;inset:5px;border:3px solid #ffecd0;border-radius:50%;background:radial-gradient(#624b2b 1.5px,transparent 2px) 0 0/7px 7px,#facd4c}
@media(max-width:1000px){.tray-row{gap:12px}.tray{gap:5px}.tray .tile{width:46px}.fire{padding:0 18px}.fire span{margin-left:8px}}
.look-gardener .body{background:linear-gradient(120deg,#79abd0,#3974a4)}
.look-gardener .body i{background:#e5b96b;clip-path:none;width:22px;height:16px;left:16px;top:17px;border:2px solid #bc904f;border-radius:3px}
.look-gardener .head:before{content:'';position:absolute;left:-10px;top:-14px;width:90px;height:17px;border-radius:50%;background:#e4bf75;border:3px solid #b88a47;box-shadow:inset 0 5px #f5dca0;z-index:5}
.look-gardener .hair{top:-29px;left:11px;width:48px;height:23px;transform:none;box-shadow:none;border-radius:15px 15px 0 0;background:#efca81;border-bottom:6px solid #7aab6b;z-index:6}
.look-runner .head{background:radial-gradient(circle at 25% 20%,#b7e2c0,#75b5aa 65%,#4c8d87);border-radius:33px 22px 28px 19px;border-color:#58958d}
.look-runner .body{background:linear-gradient(120deg,#f5ba6a,#e17b49);border-radius:9px 15px 6px 7px}
.look-runner .body i{clip-path:none;top:12px;left:17px;width:24px;height:23px;background:#fff4d7;border-radius:3px}
.look-runner .body i:after{content:'02';position:absolute;inset:3px;font:bold 14px Arial;color:#b66041}
.look-runner .arm:before{background:#ee9554}.look-runner .leg{background:#634879}.look-runner .leg:after{background:#f6e4bf;border-color:#cc8553}
.look-runner .head:before{content:'';position:absolute;left:-2px;right:-2px;top:9px;height:9px;background:#e87058;border:2px solid #b85147;border-radius:7px;z-index:4}
.look-runner .hair{top:-13px;left:30px;width:9px;height:19px;background:#436b69;box-shadow:9px 4px #436b69,-8px 3px #436b69}
.look-runner .eye.right{height:20px;top:21px}
.enemy.look-king .body{background:linear-gradient(100deg,#b76aaa,#713a88);border:3px solid #edbf61;border-radius:14px 14px 7px 7px}
.look-king .body i{background:#f7d27d;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);width:19px;height:23px;left:15px;top:9px}
.look-king .arm:before{background:#9f529f;border-bottom:5px solid #eac76d}.look-king .leg{background:#54365f}
.look-king .head{background:radial-gradient(circle at 25% 20%,#c8d57b,#94b454 65%,#728638);border-color:#7e963e;border-radius:21px 23px 17px 17px}
.look-king .head:before{content:'';position:absolute;top:-24px;left:9px;width:53px;height:30px;background:linear-gradient(#fff0a3,#e6a940);clip-path:polygon(0 0,27% 37%,50% 0,73% 37%,100% 0,90% 100%,10% 100%);filter:drop-shadow(0 2px 0 #97662d);z-index:6}
.look-king .hair{display:none}.look-king .eye{border-top:5px solid #687f3c}.look-king .mouth{height:15px;width:30px}.look-king .mouth:after{box-shadow:13px 0 #fff8d9}
.boss-health{font-size:16px;box-shadow:0 4px #64466525;border:2px solid #d7adc3}
  </style>
</head>
<body>
<main class="game" id="game">
  <header class="hud">
    <div class="brand"><span class="brand-icon">✦</span><div>SPELL DEFENSE<small>FRUIT WORLD · V0.1</small></div></div>
    <div class="wave-info"><small id="waveLabel">YOUR GARDEN NEEDS YOU</small><div id="waveDots" class="wave-dots"></div></div>
    <div class="score"><small>SCORE</small><strong id="score">0</strong></div>
    <div class="health"><small>BASE HEALTH</small><strong id="health">♥ ♥ ♥</strong></div>
    <button id="mute" class="sound" aria-label="Mute sound" title="Sound on / off">♫</button>
  </header>
  <section class="battlefield" id="battlefield" aria-label="Garden battlefield">
    <div class="sun"></div><div class="hills hill-one"></div><div class="hills hill-two"></div>
    <div class="road"></div><div class="road-dashes"></div>
    <div class="garden-sign">🍎<span>FRUIT<br>GARDEN</span></div>
    <div class="tree tree-left"><div>🍎</div></div><div class="tree tree-right"><div>🍊</div></div>
    <div class="fence fence-left"></div><div class="fence fence-right"></div>
    <div class="patch patch-left">✿ <span>✿</span> ✿</div><div class="patch patch-right">✿ <span>✿</span> ✿</div>
    <div class="crate crate-left">🍎🍐</div><div class="crate crate-right">🍊🍋</div>
    <div class="pebble p1"></div><div class="pebble p2"></div><div class="pebble p3"></div>
    <div class="combo" id="combo">LET’S GROW A WIN!</div>
    <div class="boss-health" id="bossHealth" hidden></div>
    <div class="danger-line"><span>DEFEND THE GARDEN</span></div>
    <div id="enemy" class="enemy" hidden>
      <div class="thought" id="thought" role="img" aria-label="Fruit to spell">🍎</div>
      <div class="zombie">
        <div class="shadow"></div><div class="leg left"></div><div class="leg right"></div>
        <div class="arm left"></div><div class="arm right"></div><div class="body"><i></i></div>
        <div class="head"><div class="hair"></div><div class="ear left"></div><div class="ear right"></div><div class="eye left"></div><div class="eye right"></div><div class="nose"></div><div class="mouth"></div><div class="stitch">× ×</div></div>
      </div>
    </div>
    <div class="base" id="base"><div class="turret" id="turret"><div class="barrel"><div id="muzzle" class="muzzle"></div></div><div class="turret-dome"></div></div><div class="fort"><i></i><i></i><i></i><span>✦</span></div><div class="base-shadow"></div></div>
    <div class="feedback" id="feedback" aria-live="polite"></div><div class="effects" id="effects"></div>
  </section>
  <section class="controls" aria-label="Spelling controls">
    <div class="control-top"><span class="eyebrow">SPELL IT. SEND IT!</span><span id="hint">Look at the fruit. Fill the missing letters.</span><span id="wordCount">00 / 12 WORDS</span></div>
    <div id="slots" class="slots" aria-label="Word slots"></div>
    <div class="tray-row"><div class="tray-label">LETTER<br>SUPPLY <span>↗</span></div><div id="tray" class="tray" aria-label="Available letters"></div><button id="fire" class="fire" disabled>FIRE! <span>↟</span></button></div>
    <div class="control-footer"><span>Drag a tile · or tap a letter, then a space</span><span>Type letters + Enter to fire</span></div>
  </section>
  <div class="overlay" id="overlay"><section class="start-card"><div class="world-tag">🍎 FRUIT WORLD</div><div class="title-kicker">A LITTLE SPELLING. A BIG ADVENTURE.</div><h1>ZOMBIE<br><span>SPELL DEFENSE</span></h1><p>Spell the word.<br>Stop the zombies!</p><button class="play" id="play">PLAY <span>➜</span></button><div class="start-notes"><span>✦ 3 waves</span><span>♥ 3 lives</span><span>★ BOSS · 5 HP</span></div></section></div>
</main>
<div class="rotate"><span>↻</span><strong>Rotate your device</strong><p>Your garden adventure plays best in landscape.</p></div>
<script>
/* ----- 修正版 JavaScript（核心改动已标注） ----- */
const categories = { fruit: [
 {word:'APPLE',icon:'🍎',wave:1}, {word:'PEAR',icon:'🍐',wave:1}, {word:'GRAPE',icon:'🍇',wave:1},
 {word:'PINEAPPLE',icon:'🍍',wave:2}, {word:'STRAWBERRY',icon:'🍓',wave:2},
 {word:'DRAGON FRUIT',icon:'dragon',clue:'火龙果',wave:2}, {word:'PASSION FRUIT',icon:'passion',clue:'百香果',wave:2},
 {word:'WATERMELON',icon:'🍉',wave:3}, {word:'COCONUT',icon:'🥥',wave:3}, {word:'KIWI',icon:'🥝',wave:3}, {word:'MANGO',icon:'🥭',wave:3}, {word:'BLUEBERRY',icon:'🫐',wave:3}
] };
const waves = [{count:3,speed:24,look:"gardener"},{count:4,speed:28,look:"runner"},{count:1,speed:22,boss:true,hp:5,look:"king"}];
const isBossWave = () => Boolean(waves[gameState.wave-1]?.boss);
const bossMaxHP = 5;
const totalWords=12;
const $ = id => document.getElementById(id);
const ui = Object.fromEntries(['game','battlefield','score','health','waveLabel','waveDots','combo','bossHealth','enemy','thought','slots','tray','fire','hint','wordCount','feedback','effects','turret','overlay','mute'].map(id=>[id,$(id)]));
let gameState, audioContext, muted=false, tutorialDone=false, timers=[], generation=0, selected=null, drag=null, lastTime=0;
let gameActive = false; // 新增：控制动画循环是否继续
const shuffle = values => { const a=[...values]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a; };
function later(fn,ms){const run=generation;const id=setTimeout(()=>{timers=timers.filter(t=>t!==id);if(run===generation)fn();},ms);timers.push(id);}
function sound(type){if(muted||!audioContext)return;const tones={pickup:[500,.045],drop:[670,.08],correct:[880,.19],wrong:[150,.16],fire:[390,.14],death:[580,.14],damage:[95,.23],win:[1050,.45]};const [freq,duration]=tones[type]||tones.drop;try{const o=audioContext.createOscillator(),g=audioContext.createGain(),t=audioContext.currentTime;o.type=['fire','damage','wrong'].includes(type)?'triangle':'sine';o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(type==='correct'||type==='win'?freq*1.5:freq*.4,t+duration);g.gain.setValueAtTime(.09,t);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g);g.connect(audioContext.destination);o.start(t);o.stop(t+duration);}catch{}}
function animateClass(el,name,ms=350){el.classList.remove(name);void el.offsetWidth;el.classList.add(name);later(()=>el.classList.remove(name),ms);}
function feedback(text,wrong=false,ms=750){ui.feedback.textContent=text;ui.feedback.classList.toggle('wrong',wrong);later(()=>{if(ui.feedback.textContent===text)ui.feedback.textContent='';},ms);}
function startGame(){
  generation++; // 增加generation，使旧定时器失效
  timers.forEach(clearTimeout); timers=[];
  cancelDrag(); selected=null;
  ui.effects.replaceChildren(); ui.feedback.textContent=''; ui.game.classList.remove('shaking','tiny-shake'); ui.turret.classList.remove('shoot'); ui.overlay.hidden=true;
  // 音频初始化及恢复
  if(!audioContext){ try{ audioContext = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){} }
  if(audioContext && audioContext.state === 'suspended'){
    audioContext.resume().catch(()=>{});
  }
  if(audioContext) audioContext.resume().catch(()=>{});
  gameActive = true;
  gameState = { score:0, combo:0, bestCombo:0, baseHP:3, wave:1, zombieIndex:0, currentWord:null, currentZombie:null, bossHP:0, submissions:0, correctFullWords:0, incorrectAttempts:0, wordsCompleted:0, isPaused:false, gameOver:false, phase:'playing', encounter:0, deck:[], deckWave:0, slots:[], tiles:[], tutorial:!tutorialDone };
  startMusic(); spawnZombie();
}
function chooseWord(){
  const s=gameState;
  if(s.deckWave!==s.wave || !s.deck.length){
    s.deck=shuffle(categories.fruit.filter(f=>f.wave===s.wave));
    s.deckWave=s.wave;
    if(s.encounter===0){ s.deck=s.deck.filter(f=>f.word!=='APPLE'); s.deck.unshift(categories.fruit[0]); }
  }
  // 防空数组
  if(s.deck.length===0){
    s.deck=shuffle(categories.fruit.filter(f=>f.wave===s.wave));
    s.deckWave=s.wave;
  }
  // 避免重复
  if(s.deck[0] === s.currentWord){
    s.deck.push(s.deck.shift());
  }
  return s.deck.shift();
}
function makePuzzle(fruit,opening=false){
  selected=null; cancelDrag();
  gameState.currentWord=fruit;
  const n=fruit.word.length, w=gameState.wave;
  const letters=[...fruit.word].map((l,i)=>l===' '?-1:i).filter(i=>i>=0);
  const hidden=opening?[0,3]:shuffle(letters).slice(0,w===1?1:Math.ceil(letters.length*(w===2?.45:.6)));
  gameState.slots=[...fruit.word].map((letter,i)=>({answer:letter,locked:!hidden.includes(i),tileId:null}));
  const missing=hidden.map(i=>fruit.word[i]);
  const distractors=shuffle([...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].filter(l=>!missing.includes(l))).slice(0,opening?2:3);
  gameState.tiles=shuffle([...missing,...distractors]).map((letter,id)=>({letter,id}));
  ui.thought.replaceChildren();
  if(fruit.clue){ const art=document.createElement('div'); art.className='fruit-art '+fruit.icon; ui.thought.append(art); const label=document.createElement('small'); label.textContent=fruit.clue; ui.thought.append(label); }
  else ui.thought.textContent=fruit.icon;
  ui.thought.setAttribute('aria-label',fruit.clue||`Fruit clue: ${fruit.icon}`);
  renderPuzzle();
}
function spawnZombie(){
  if(gameState.encounter>0) gameState.tutorial=false;
  gameState.phase='playing'; gameState.isPaused=false;
  const boss=isBossWave();
  gameState.currentZombie={ progress:0, x:boss?50:48+Math.random()*4 };
  if(boss) gameState.bossHP=bossMaxHP;
  ui.enemy.className='enemy look-'+waves[gameState.wave-1].look+(boss?' boss':'');
  ui.enemy.hidden=false;
  makePuzzle(chooseWord(), gameState.encounter===0);
  gameState.encounter++;
  renderHUD(); positionZombie();
}
function renderHUD(){
  const s=gameState;
  ui.score.textContent=s.score.toLocaleString();
  ui.health.textContent=Array.from({length:3},(_,i)=>i<s.baseHP?'♥':'♡').join(' ');
  ui.health.setAttribute('aria-label',`${s.baseHP} of 3 lives`);
  ui.waveLabel.textContent=`WAVE ${s.wave} / ${waves.length}${isBossWave()?' · BIG ZOMBIE':` · ${s.zombieIndex+1} OF ${waves[s.wave-1].count}`}`;
  ui.waveDots.innerHTML=waves.map((_,i)=>`<i class="${i<s.wave?'active':''}"></i>`).join('');
  ui.combo.textContent=s.combo?`COMBO ×${s.combo}  ${s.combo>=10?'⚡ LIGHTNING SHOT':s.combo>=5?'🚀 ROCKET SHOT':s.combo>=3?'🔥 FIRE SHOT':'✦ NICE SPELLING!'}`:'LET’S GROW A WIN!';
  ui.bossHealth.hidden=!isBossWave();
  ui.bossHealth.textContent=`BOSS ${'♥ '.repeat(s.bossHP)}${'♡ '.repeat(Math.max(0,bossMaxHP-s.bossHP))}`;
  ui.wordCount.textContent=`${String(s.wordsCompleted).padStart(2,'0')} / ${totalWords} WORDS`;
}
function renderPuzzle(){
  const s=gameState;
  ui.slots.replaceChildren();
  s.slots.forEach((slot,i)=>{
    const b=document.createElement('button');
    b.className='slot'+(slot.answer===' '?' word-space':'')+(slot.locked?' locked':slot.tileId!==null?' filled':'');
    b.dataset.slot=i;
    let displayChar = slot.locked ? slot.answer : (slot.tileId!==null ? (s.tiles[slot.tileId] ? s.tiles[slot.tileId].letter : '') : '');
    b.textContent = displayChar;
    b.setAttribute('aria-label',slot.locked?`Letter ${i+1}: ${slot.answer}, locked`:`Letter ${i+1}: ${b.textContent||'empty'}`);
    b.disabled=slot.locked || s.phase!=='playing';
    b.onclick=()=>{
      if(s.phase!=='playing' || slot.locked) return;
      if(selected!==null) placeTile(selected,i);
      else if(slot.tileId!==null){ slot.tileId=null; sound('pickup'); renderPuzzle(); }
    };
    ui.slots.append(b);
  });
  ui.tray.replaceChildren();
  s.tiles.forEach((tile, idx)=>{
    const used=s.slots.some(slot=>slot.tileId===tile.id);
    const b=document.createElement('button');
    b.className='tile'+(used?' used':'')+(selected===tile.id?' selected':'')+(s.tutorial && tile.letter==='A' && !used?' tutorial':'');
    b.dataset.tile=tile.id;
    b.textContent=tile.letter;
    b.disabled=used||s.phase!=='playing';
    b.setAttribute('aria-label',`Letter ${tile.letter}`);
    b.addEventListener('pointerdown',pickup);
    b.onclick=()=>{
      if(s.phase!=='playing') return;
      selected=selected===tile.id?null:tile.id;
      renderPuzzle();
    };
    ui.tray.append(b);
  });
  const complete=s.slots.every(slot=>slot.locked || slot.tileId!==null);
  ui.fire.disabled=s.phase!=='playing';
  ui.fire.classList.toggle('ready',complete && s.tutorial);
  ui.hint.textContent=s.tutorial?(complete?'Press FIRE!':'Drag A and L into the spaces!'):'Look at the fruit. Fill the missing letters.';
}
function placeTile(id,index){
  const s=gameState, slot=s.slots[index];
  if(s.phase!=='playing'||!slot||slot.locked) return;
  for(const other of s.slots) if(other.tileId===id) other.tileId=null;
  slot.tileId=id; selected=null; sound('drop'); renderPuzzle(); animateClass(ui.slots.children[index],'pop');
}
function pickup(event){ if(event.button!==0 || gameState.phase!=='playing') return; const tile=event.currentTarget; drag={id:Number(tile.dataset.tile), x:event.clientX, y:event.clientY, pointer:event.pointerId, source:tile, ghost:null}; tile.setPointerCapture(event.pointerId); sound('pickup'); }
document.addEventListener('pointermove', event=>{
  if(!drag || event.pointerId!==drag.pointer) return;
  if(!drag.ghost && Math.hypot(event.clientX-drag.x, event.clientY-drag.y)>5){ drag.ghost=drag.source.cloneNode(true); drag.ghost.className='tile drag-ghost'; drag.ghost.removeAttribute('id'); drag.ghost.setAttribute('aria-hidden','true'); document.body.append(drag.ghost); }
  if(!drag.ghost) return; event.preventDefault();
  drag.ghost.style.left=`${event.clientX-27}px`; drag.ghost.style.top=`${event.clientY-28}px`;
  const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-slot]');
  [...ui.slots.children].forEach(el=>el.classList.toggle('target',el===target && !gameState.slots[Number(el.dataset.slot)].locked));
},{passive:false});
document.addEventListener('pointerup', event=>{
  if(!drag || event.pointerId!==drag.pointer) return;
  const {id,ghost,source}=drag;
  if(ghost){
    const slot=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-slot]');
    source.addEventListener('click', e=>{ e.stopImmediatePropagation(); e.preventDefault(); },{once:true,capture:true});
    cancelDrag();
    if(slot) placeTile(id, Number(slot.dataset.slot));
  } else cancelDrag();
});
document.addEventListener('pointercancel', cancelDrag);
function cancelDrag(){ if(drag){ drag.ghost?.remove(); try{ drag.source.releasePointerCapture(drag.pointer); }catch{} drag=null; } if(ui.slots) [...ui.slots.children].forEach(el=>el.classList.remove('target')); }
document.addEventListener('keydown', event=>{
  if(!gameState || gameState.phase!=='playing' || event.ctrlKey || event.metaKey || event.altKey) return;
  if(event.key==='Enter'){ event.preventDefault(); submit(); return; }
  if(event.key==='Backspace'){ event.preventDefault(); const slot=[...gameState.slots].reverse().find(s=>!s.locked && s.tileId!==null); if(slot){ slot.tileId=null; renderPuzzle(); } return; }
  if(/^[a-z]$/i.test(event.key)){
    const tile=gameState.tiles.find(t=>t.letter===event.key.toUpperCase() && !gameState.slots.some(s=>s.tileId===t.id));
    const i=gameState.slots.findIndex(s=>!s.locked && s.tileId===null);
    if(tile && i>=0){ event.preventDefault(); placeTile(tile.id,i); }
  }
});
function submit(){
  const s=gameState;
  if(!s || s.phase!=='playing') return;
  cancelDrag();
  const empty=s.slots.map((slot,i)=>!slot.locked && slot.tileId===null ? i : -1).filter(i=>i>=0);
  if(empty.length){ empty.forEach(i=>animateClass(ui.slots.children[i],'bad')); feedback('Fill every space!',false,650); sound('wrong'); return; }
  s.submissions++;
  const wrong=[];
  s.slots.forEach((slot,i)=>{
    if(!slot.locked){
      if(s.tiles[slot.tileId] && s.tiles[slot.tileId].letter === slot.answer) slot.locked=true;
      else { wrong.push(i); slot.tileId=null; }
    }
  });
  if(wrong.length){ s.incorrectAttempts++; s.combo=0; selected=null; renderPuzzle(); s.slots.forEach((slot,i)=>{ if(slot.locked) animateClass(ui.slots.children[i],'good',450); }); wrong.forEach(i=>animateClass(ui.slots.children[i],'bad',450)); renderHUD(); feedback('✕',true,400); sound('wrong'); return; }
  s.phase='attacking'; s.isPaused=true; s.correctFullWords++; s.wordsCompleted++; s.combo++; s.bestCombo=Math.max(s.bestCombo,s.combo);
  const bonus=Math.round(100*(1-s.currentZombie.progress));
  const points=(100+bonus)*Math.min(s.combo,5);
  s.score+=points; tutorialDone=true; s.tutorial=false; renderPuzzle(); renderHUD(); animateClass(ui.combo,'pop'); feedback('✓ PERFECT!',false,600); sound('correct'); shoot(points);
}
function shoot(points){
  animateClass(ui.turret,'shoot',300); animateClass(ui.game,'tiny-shake',160); sound('fire');
  const field=ui.battlefield.getBoundingClientRect(), target=ui.enemy.getBoundingClientRect(), barrel=ui.turret.getBoundingClientRect();
  const scale=field.width/ui.battlefield.clientWidth;
  const start={x:(barrel.left+barrel.width/2-field.left)/scale-10, y:(barrel.top-field.top)/scale};
  const end={x:(target.left+target.width/2-field.left)/scale-10, y:(target.top-field.top)/scale+52};
  const bullet=document.createElement('div');
  bullet.className='projectile '+(gameState.combo>=10?'lightning-shot':gameState.combo>=5?'rocket-shot':gameState.combo>=3?'fire-shot':'');
  bullet.style.left=`${start.x}px`; bullet.style.top=`${start.y}px`; ui.effects.append(bullet);
  bullet.animate([{transform:'translate(0,0)'},{transform:`translate(${end.x-start.x}px,${end.y-start.y}px)`}],{duration:300,easing:'ease-in'});
  later(()=>{
    bullet.remove(); burst(end.x,end.y); sound('death');
    const float=document.createElement('div'); float.className='float-score'; float.textContent=`+${points}`; float.style.left=`${end.x-25}px`; float.style.top=`${end.y}px`; ui.effects.append(float); later(()=>float.remove(),900);
    const boss=isBossWave();
    if(boss) gameState.bossHP--;
    renderHUD();
    ui.enemy.classList.add(boss && gameState.bossHP>0 ? 'hit' : 'dying');
    later(()=>{
      if(boss && gameState.bossHP>0){ ui.enemy.classList.remove('hit'); gameState.currentZombie.progress=Math.max(0, gameState.currentZombie.progress-.2); gameState.phase='playing'; gameState.isPaused=false; makePuzzle(chooseWord()); positionZombie(); }
      else if(boss){ finish(true); }
      else nextEnemy();
    },550);
  },300);
}
function burst(x,y){ for(let i=0;i<12;i++){ const p=document.createElement('i'); p.className='particle'; p.style.left=`${x}px`; p.style.top=`${y}px`; p.style.setProperty('--dx',`${Math.cos(i*Math.PI/6)*(35+Math.random()*35)}px`); p.style.setProperty('--dy',`${Math.sin(i*Math.PI/6)*(35+Math.random()*35)}px`); p.style.setProperty('--color',['#fff6ae','#b4dc78','#f5bf58'][i%3]); ui.effects.append(p); later(()=>p.remove(),650); } }
function nextEnemy(){ ui.enemy.hidden=true; gameState.zombieIndex++; if(gameState.zombieIndex>=waves[gameState.wave-1].count){ gameState.wave++; gameState.zombieIndex=0; if(isBossWave()) gameState.bossHP=bossMaxHP; gameState.phase='transition'; gameState.isPaused=true; renderHUD(); feedback(isBossWave()?'FINAL WAVE · BOSS!':'WAVE COMPLETE!',false,1200); later(spawnZombie,1300); } else spawnZombie(); }
function baseHit(){
  const s=gameState;
  if(s.gameOver) return; // 防止重复结束
  if(s.phase!=='playing') return;
  cancelDrag(); s.baseHP--; s.combo=0; s.phase='transition'; s.isPaused=true; animateClass(ui.game,'shaking'); feedback('OUCH! −1 ♥',true,600); sound('damage'); renderHUD(); renderPuzzle();
  if(s.baseHP===0){ later(()=>finish(false),650); return; }
  if(isBossWave()){
    const from=s.currentZombie.progress, to=.5;
    const h=ui.battlefield.clientHeight, start=102, end=Math.max(start+60,h*.8-105);
    ui.enemy.animate([{transform:'translateY('+(start+(end-start)*from)+'px)'},{transform:'translateY('+(start+(end-start)*to)+'px)'}],{duration:650,easing:'ease-out'});
    s.currentZombie.progress=to; positionZombie(); animateClass(ui.enemy,'hit',650);
    later(()=>{ s.phase='playing'; s.isPaused=false; renderPuzzle(); },650);
  }else{ ui.enemy.hidden=true; later(nextEnemy,850); }
}
function finish(won){
  stopMusic();
  gameState.gameOver=true; gameState.phase=won?'victory':'gameover'; gameState.isPaused=true; ui.enemy.hidden=true; cancelDrag(); renderPuzzle(); ui.feedback.textContent=''; sound(won?'win':'damage');
  const s=gameState, accuracy=s.submissions?Math.round(s.correctFullWords/s.submissions*100):0;
  ui.overlay.innerHTML=`<section class="start-card"><div class="world-tag">🍎 FRUIT WORLD</div><div class="stars">${won?'⭐ ⭐ ⭐':'♡ ♡ ♡'}</div><h1 class="result-title">${won?'FRUIT MASTER!':'GAME OVER'}</h1><p>${won?'The garden is safe. Brilliant spelling!':'Your garden needs another hero.<br>Let’s give it another grow!'}</p><div class="stats"><div>SCORE<strong>${s.score.toLocaleString()}</strong></div><div>BEST COMBO<strong>×${s.bestCombo}</strong></div><div>ACCURACY<strong>${accuracy}%</strong></div><div>WORDS COMPLETED<strong>${s.wordsCompleted}</strong></div></div><button class="play" id="restart">${won?'PLAY AGAIN':'TRY AGAIN'} <span>➜</span></button></section>`;
  ui.overlay.hidden=false; $('#restart').onclick=startGame; $('#restart').focus();
}
function positionZombie(){ if(!gameState?.currentZombie) return; const h=ui.battlefield.clientHeight; const start=isBossWave()?102:39; const end=Math.max(start+60,h*.8-105); ui.enemy.style.left=`${gameState.currentZombie.x}%`; ui.enemy.style.transform=`translateY(${start+(end-start)*gameState.currentZombie.progress}px)`; }
function tick(time){
  if(!gameActive) return; // 游戏未激活则停止更新
  const dt=lastTime?Math.min((time-lastTime)/1000,.1):0; lastTime=time;
  if(gameState?.phase==='playing'){
    gameState.currentZombie.progress+=waves[gameState.wave-1].speed*dt/470;
    positionZombie();
    if(gameState.currentZombie.progress>=1) baseHit();
  }
  requestAnimationFrame(tick);
}
ui.fire.onclick=submit; $('#play').onclick=startGame;
ui.mute.onclick=()=>{ muted=!muted; if(musicGain) musicGain.gain.setTargetAtTime(muted?0:.22, audioContext.currentTime,.04); ui.mute.textContent=muted?'♪̸':'♫'; ui.mute.setAttribute('aria-label',muted?'Unmute sound':'Mute sound'); ui.mute.setAttribute('aria-pressed',String(muted)); };
window.addEventListener('resize',positionZombie);
requestAnimationFrame(tick);
function fitCompactViewport(){ ui.game.style.setProperty('--compact-scale',String(Math.min(1,window.innerHeight/520))); positionZombie(); }
window.addEventListener('resize',fitCompactViewport); fitCompactViewport();

// 音乐循环（修正：增加generation检查）
let musicGain=null, musicTimer=null, musicStep=0, musicNext=0;
const musicVoices=new Set();
function musicNote(midi,time,duration,type,volume){
  if(!musicGain) return;
  const o=audioContext.createOscillator(), g=audioContext.createGain();
  o.type=type; o.frequency.value=440*Math.pow(2,(midi-69)/12);
  g.gain.setValueAtTime(0,time); g.gain.linearRampToValueAtTime(volume,time+.012); g.gain.exponentialRampToValueAtTime(.0001,time+duration);
  o.connect(g); g.connect(musicGain);
  o.start(time); o.stop(time+duration+.03);
  musicVoices.add(o);
  o.onended=()=>{ musicVoices.delete(o); o.disconnect(); g.disconnect(); };
}
function startMusic(){
  stopMusic();
  if(!audioContext) return;
  musicGain=audioContext.createGain();
  musicGain.gain.value=muted?0:.22;
  musicGain.connect(audioContext.destination);
  musicStep=0; musicNext=audioContext.currentTime+.06;
  scheduleMusic();
}
function scheduleMusic(){
  if(!musicGain) return;
  // 检查generation，若已变化则停止调度
  if(!gameActive) return; // 如果游戏已结束，不再继续
  if(musicNext < audioContext.currentTime-.3) musicNext=audioContext.currentTime+.02;
  const melody=[81,null,84,88,87,null,84,83,81,null,76,79,80,null,83,76,77,null,81,84,83,null,81,80,76,null,80,83,88,87,83,null];
  const bass=[45,45,41,40];
  while(musicNext < audioContext.currentTime+.16){
    const step=musicStep%32, note=melody[step];
    if(note!==null){ musicNote(note,musicNext,.34,'sine',.4); musicNote(note+12,musicNext,.14,'sine',.055); }
    if(step%4===0) musicNote(bass[Math.floor(step/8)],musicNext,.38,'triangle',.38);
    if(step%4===2) musicNote(bass[Math.floor(step/8)]+12,musicNext,.16,'triangle',.16);
    if(step%2===1) musicNote(98,musicNext,.035,'triangle',.04);
    musicNext+=60/108/2; musicStep++;
  }
  musicTimer=setTimeout(scheduleMusic,60);
}
function stopMusic(){
  clearTimeout(musicTimer); musicTimer=null;
  for(const o of musicVoices){ try{ o.stop(); }catch{} }
  musicVoices.clear();
  if(musicGain){ musicGain.disconnect(); musicGain=null; }
}
</script>
</body>
</html>
