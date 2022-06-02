/**
 * 流程轨迹测试数据
 * trackData 流程轨迹数据
 * botData 波特图数据
 */
var baseGraphic = {"processBaseData":{"HAS-ACTION":[],"HAS-DEFAULT-ACTIONS":"/test/order/data","FLOW":"TRUE","name":"orderProcess","ruleData":{},"LABEL":"AAA","type":"process","eventData":{"onBeforeQuery":"onBeforeQueryorderProcessProcedure"}},"processMainData":{"bizActivity5|end2":{"targetNode":"end23117751","style":{"targetNode":"end23117751","inPortDir":3,"sourceNode":"bizActivity5-227338445","points":[{"y":356,"x":55},{"y":586,"x":55},{"y":586,"x":177}],"outPortDir":2},"sourceNode":"bizActivity5-227338445","type":"connection","varIn":"x"},"xor5|bizActivity5":{"targetNode":"bizActivity5-227338445","style":{"targetNode":"bizActivity5-227338445","inPortDir":0,"sourceNode":"xor53685178","points":[{"y":200,"x":55},{"y":326,"x":55}],"outPortDir":2},"varOut":"x","sourceNode":"xor53685178","type":"connection"},"xor11114240443":{"style":{"bound":{"w":40,"h":40,"y":290,"x":289}},"name":"xor11","LABEL":"XOR","type":"xor"},"xor16|xor17":{"targetNode":"xor17114240449","style":{"targetNode":"xor17","inPortDir":0,"sourceNode":"xor16","points":[{"y":387,"x":393},{"y":407,"x":393}],"outPortDir":2},"varOut":"\"x\"","sourceNode":"xor16114240448","varIn":"\"x\"","type":"connection"},"xor15|xor16":{"targetNode":"xor16114240448","style":{"targetNode":"xor16","inPortDir":0,"sourceNode":"xor15","points":[{"y":327,"x":393},{"y":347,"x":393}],"outPortDir":2},"varOut":"\"x\"","sourceNode":"xor15114240447","varIn":"\"x\"","type":"connection"},"xor10114240442":{"style":{"bound":{"w":40,"h":40,"y":230,"x":289}},"name":"xor10","LABEL":"XOR","type":"xor"},"xor16114240448":{"style":{"bound":{"w":40,"h":40,"y":348,"x":374}},"name":"xor16","LABEL":"XOR","type":"xor"},"xor11|xor12":{"targetNode":"xor12114240444","style":{"targetNode":"xor12","inPortDir":0,"sourceNode":"xor11","points":[{"y":329,"x":308},{"y":349,"x":308}],"outPortDir":2},"varOut":"\"x\"","sourceNode":"xor11114240443","varIn":"\"x\"","type":"connection"},"xor53685178":{"style":{"bound":{"w":40,"h":40,"y":161,"x":36}},"name":"xor5","LABEL":"XOR","type":"xor"},"startActivity-1528850031":{"HAS-ACTION":[],"name":"startActivity","LABEL":"流程启动环节","type":"staticActivity","eventData":{"onBeforeQuery":"onBeforeQuerystartActivityProcedure","onAfterQuery":"onAfterQuerystartActivityProcedure"}},"bizActivity2-227338448":{"CONDITION":"TRUE","style":{"bound":{"w":59,"h":22,"y":207,"x":138}},"HAS-ACTION":[],"name":"bizActivity2","ruleData":{},"LABEL":"活动环节2","type":"businessActivity","eventData":{}},"start2-892483568":{"style":{"bound":{"w":40,"h":40,"y":17,"x":216}},"name":"start2","LABEL":"开始","type":"start"},"orderToken746103627":{"VALUE":"hello","name":"orderToken","type":"token"},"xor13114240445":{"style":{"bound":{"w":40,"h":40,"y":168,"x":374}},"name":"xor13","LABEL":"XOR","type":"xor"},"bizActivity1-227338449":{"CONDITION":"TRUE","style":{"bound":{"w":100,"h":30,"y":77,"x":186}},"HAS-ACTION":[],"name":"bizActivity1","ruleData":{},"LABEL":"活动环节1","type":"businessActivity","eventData":{}},"xor6|bizActivity2":{"targetNode":"bizActivity2-227338448","style":{"targetNode":"bizActivity2-227338448","inPortDir":0,"sourceNode":"xor63685179","points":[{"y":185,"x":196},{"y":185,"x":166.5},{"y":206,"x":166.5}],"outPortDir":3},"varOut":"x","sourceNode":"xor63685179","type":"connection"},"bizActivity4-227338446":{"CONDITION":"TRUE","style":{"bound":{"w":57,"h":22,"y":269,"x":320}},"HAS-ACTION":[],"name":"bizActivity4","ruleData":{},"LABEL":"活动环节4","type":"businessActivity","eventData":{}},"xor14114240446":{"style":{"bound":{"w":40,"h":40,"y":228,"x":374}},"name":"xor14","LABEL":"XOR","type":"xor"},"xor33685176":{"style":{"bound":{"w":40,"h":40,"y":157,"x":106}},"name":"xor3","LABEL":"XOR","type":"xor"},"bizActivity4|xor11":{"targetNode":"xor11114240443","style":{"targetNode":"xor11114240443","inPortDir":1,"sourceNode":"bizActivity4-227338446","points":[{"y":290,"x":347.5},{"y":309,"x":347.5},{"y":309,"x":328}],"outPortDir":2},"sourceNode":"bizActivity4-227338446","type":"connection","varIn":"x"},"xor3|xor4":{"targetNode":"xor43685177","style":{"targetNode":"xor4","inPortDir":0,"sourceNode":"xor3","points":[{"y":196,"x":125},{"y":238,"x":125}],"outPortDir":2},"varOut":"\"x\"","sourceNode":"xor33685176","varIn":"\"x\"","type":"connection"},"xor43685177":{"style":{"bound":{"w":40,"h":40,"y":239,"x":106}},"name":"xor4","LABEL":"XOR","type":"xor"},"bizActivity2|xor8":{"targetNode":"xor83685181","style":{"targetNode":"xor83685181","inPortDir":3,"sourceNode":"bizActivity2-227338448","points":[{"y":228,"x":166.5},{"y":305,"x":166.5},{"y":305,"x":196}],"outPortDir":2},"sourceNode":"bizActivity2-227338448","type":"connection","varIn":"x"},"x3333|end2":{"targetNode":"end23117751","style":{"targetNode":"end2","inPortDir":2,"sourceNode":"x3333","points":[{"y":656,"x":297},{"y":656,"x":197},{"y":606,"x":197}],"outPortDir":3},"varOut":"\"x\"","sourceNode":"x3333112392504","varIn":"\"x\"","type":"connection"},"xor6|xor7":{"targetNode":"xor73685180","style":{"targetNode":"xor7","inPortDir":0,"sourceNode":"xor6","points":[{"y":205,"x":216},{"y":225,"x":216}],"outPortDir":2},"varOut":"\"x\"","sourceNode":"xor63685179","varIn":"\"x\"","type":"connection"},"bizActivity8-227338442":{"style":{"bound":{"w":100,"h":30,"y":437,"x":156}},"HAS-ACTION":[],"name":"bizActivity8","ruleData":{},"LABEL":"活动环节8","type":"businessActivity","eventData":{}},"bizActivity10|x3333":{"targetNode":"x3333112392504","style":{"targetNode":"x3333112392504","inPortDir":1,"sourceNode":"bizActivity101542442721","points":[{"y":576,"x":405},{"y":656,"x":405},{"y":656,"x":337}],"outPortDir":2},"sourceNode":"bizActivity101542442721","type":"connection","varIn":"x"},"xor7|xor8":{"targetNode":"xor83685181","style":{"targetNode":"xor8","inPortDir":0,"sourceNode":"xor7","points":[{"y":265,"x":216},{"y":285,"x":216}],"outPortDir":2},"varOut":"\"x\"","sourceNode":"xor73685180","varIn":"\"x\"","type":"connection"},"bizActivity3|xor16":{"targetNode":"xor16114240448","style":{"targetNode":"xor16114240448","inPortDir":1,"sourceNode":"bizActivity3-227338447","points":[{"y":318,"x":507},{"y":367,"x":507},{"y":367,"x":413}],"outPortDir":2},"sourceNode":"bizActivity3-227338447","type":"connection","varIn":"x"},"xor63685179":{"style":{"bound":{"w":40,"h":40,"y":166,"x":197}},"name":"xor6","LABEL":"XOR","type":"xor"},"bizActivity101542442721":{"style":{"bound":{"w":100,"h":30,"y":547,"x":356}},"HAS-ACTION":[],"name":"bizActivity10","ruleData":{},"LABEL":"活动环节10","type":"businessActivity","eventData":{}},"xor14|xor15":{"targetNode":"xor15114240447","style":{"targetNode":"xor15","inPortDir":0,"sourceNode":"xor14","points":[{"y":267,"x":393},{"y":287,"x":393}],"outPortDir":2},"varOut":"\"x\"","sourceNode":"xor14114240446","varIn":"\"x\"","type":"connection"},"xor17|bizActivity10":{"targetNode":"bizActivity101542442721","style":{"targetNode":"bizActivity101542442721","inPortDir":0,"sourceNode":"xor17114240449","points":[{"y":447,"x":393},{"y":496.5,"x":393},{"y":496.5,"x":405},{"y":546,"x":405}],"outPortDir":2},"varOut":"x","sourceNode":"xor17114240449","type":"connection"},"start2|bizActivity1":{"targetNode":"bizActivity1-227338449","style":{"targetNode":"bizActivity1-227338449","inPortDir":0,"sourceNode":"start2-892483568","points":[{"y":56,"x":235},{"y":76,"x":235}],"outPortDir":2},"varOut":"x","sourceNode":"start2-892483568","type":"connection"},"xor10|xor11":{"targetNode":"xor11114240443","style":{"targetNode":"xor11","inPortDir":0,"sourceNode":"xor10","points":[{"y":269,"x":308},{"y":289,"x":308}],"outPortDir":2},"varOut":"\"x\"","sourceNode":"xor10114240442","varIn":"\"x\"","type":"connection"},"bizActivity7-227338443":{"style":{"bound":{"w":100,"h":30,"y":386,"x":67}},"HAS-ACTION":[],"name":"bizActivity7","ruleData":{},"LABEL":"活动环节7","type":"businessActivity","eventData":{}},"bizActivity1|xor13":{"targetNode":"xor13114240445","style":{"targetNode":"xor13114240445","inPortDir":0,"sourceNode":"bizActivity1-227338449","points":[{"y":106,"x":235},{"y":136.5,"x":235},{"y":136.5,"x":393},{"y":167,"x":393}],"outPortDir":2},"sourceNode":"bizActivity1-227338449","type":"connection","varIn":"x"},"xor15114240447":{"style":{"bound":{"w":40,"h":40,"y":288,"x":374}},"name":"xor15","LABEL":"XOR","type":"xor"},"xor10|bizActivity4":{"targetNode":"bizActivity4-227338446","style":{"targetNode":"bizActivity4-227338446","inPortDir":0,"sourceNode":"xor10114240442","points":[{"y":249,"x":328},{"y":249,"x":347.5},{"y":268,"x":347.5}],"outPortDir":1},"varOut":"x","sourceNode":"xor10114240442","type":"connection"},"bizActivity8|end2":{"targetNode":"end23117751","style":{"targetNode":"end23117751","inPortDir":0,"sourceNode":"bizActivity8-227338442","points":[{"y":466,"x":205},{"y":516,"x":205},{"y":516,"x":197},{"y":566,"x":197}],"outPortDir":2},"sourceNode":"bizActivity8-227338442","type":"connection","varIn":"x"},"bizActivity9|end2":{"targetNode":"end23117751","style":{"targetNode":"end23117751","inPortDir":1,"sourceNode":"bizActivity9-227338441","points":[{"y":520,"x":303},{"y":586,"x":303},{"y":586,"x":217}],"outPortDir":2},"sourceNode":"bizActivity9-227338441","type":"connection","varIn":"x"},"xor4|bizActivity7":{"targetNode":"bizActivity7-227338443","style":{"targetNode":"bizActivity7-227338443","inPortDir":0,"sourceNode":"xor43685177","points":[{"y":278,"x":125},{"y":331.5,"x":125},{"y":331.5,"x":116},{"y":385,"x":116}],"outPortDir":2},"varOut":"x","sourceNode":"xor43685177","type":"connection"},"xor12|bizActivity9":{"targetNode":"bizActivity9-227338441","style":{"targetNode":"bizActivity9-227338441","inPortDir":0,"sourceNode":"xor12114240444","points":[{"y":389,"x":308},{"y":439.5,"x":308},{"y":439.5,"x":303},{"y":490,"x":303}],"outPortDir":2},"varOut":"x","sourceNode":"xor12114240444","type":"connection"},"end23117751":{"style":{"bound":{"w":40,"h":40,"y":567,"x":178}},"name":"end2","LABEL":"结束","type":"end"},"xor83685181":{"style":{"bound":{"w":40,"h":40,"y":286,"x":197}},"name":"xor8","LABEL":"XOR","type":"xor"},"xor8|bizActivity8":{"targetNode":"bizActivity8-227338442","style":{"targetNode":"bizActivity8-227338442","inPortDir":0,"sourceNode":"xor83685181","points":[{"y":325,"x":216},{"y":380.5,"x":216},{"y":380.5,"x":205},{"y":436,"x":205}],"outPortDir":2},"varOut":"x","sourceNode":"xor83685181","type":"connection"},"bizActivity1|xor3":{"targetNode":"xor33685176","style":{"targetNode":"xor33685176","inPortDir":0,"sourceNode":"bizActivity1-227338449","points":[{"y":106,"x":235},{"y":131,"x":235},{"y":131,"x":125},{"y":156,"x":125}],"outPortDir":2},"sourceNode":"bizActivity1-227338449","type":"connection","varIn":"x"},"bizActivity7|end2":{"targetNode":"end23117751","style":{"targetNode":"end23117751","inPortDir":0,"sourceNode":"bizActivity7-227338443","points":[{"y":415,"x":116},{"y":490.5,"x":116},{"y":490.5,"x":197},{"y":566,"x":197}],"outPortDir":2},"sourceNode":"bizActivity7-227338443","type":"connection","varIn":"x"},"bizActivity1|xor5":{"targetNode":"xor53685178","style":{"targetNode":"xor53685178","inPortDir":0,"sourceNode":"bizActivity1-227338449","points":[{"y":106,"x":235},{"attach":"129 133 C129 129 121 129 121 133","y":133,"x":235},{"y":133,"x":55},{"y":160,"x":55}],"outPortDir":2},"sourceNode":"bizActivity1-227338449","type":"connection","varIn":"x"},"x3333112392504":{"style":{"bound":{"w":40,"h":40,"y":637,"x":298}},"name":"x3333","LABEL":"XOR","type":"xor"},"xor73685180":{"style":{"bound":{"w":40,"h":40,"y":226,"x":197}},"name":"xor7","LABEL":"XOR","type":"xor"},"xor13|xor14":{"targetNode":"xor14114240446","style":{"targetNode":"xor14","inPortDir":0,"sourceNode":"xor13","points":[{"y":207,"x":393},{"y":227,"x":393}],"outPortDir":2},"varOut":"\"x\"","sourceNode":"xor13114240445","varIn":"\"x\"","type":"connection"},"bizActivity9-227338441":{"style":{"bound":{"w":100,"h":30,"y":491,"x":254}},"HAS-ACTION":[],"name":"bizActivity9","ruleData":{},"LABEL":"活动环节9","type":"businessActivity","eventData":{}},"xor17114240449":{"style":{"bound":{"w":40,"h":40,"y":408,"x":374}},"name":"xor17","LABEL":"XOR","type":"xor"},"xor93685182":{"style":{"bound":{"w":40,"h":40,"y":170,"x":289}},"name":"xor9","LABEL":"XOR","type":"xor"},"bizActivity5-227338445":{"style":{"bound":{"w":100,"h":30,"y":327,"x":6}},"HAS-ACTION":[],"name":"bizActivity5","ruleData":{},"LABEL":"活动环节5","type":"businessActivity","eventData":{}},"xor14|bizActivity3":{"targetNode":"bizActivity3-227338447","style":{"targetNode":"bizActivity3-227338447","inPortDir":0,"sourceNode":"xor14114240446","points":[{"y":247,"x":413},{"y":247,"x":507},{"y":288,"x":507}],"outPortDir":1},"varOut":"x","sourceNode":"xor14114240446","type":"connection"},"xor9|xor10":{"targetNode":"xor10114240442","style":{"targetNode":"xor10","inPortDir":0,"sourceNode":"xor9","points":[{"y":209,"x":308},{"y":229,"x":308}],"outPortDir":2},"varOut":"\"x\"","sourceNode":"xor93685182","varIn":"\"x\"","type":"connection"},"xor12114240444":{"style":{"bound":{"w":40,"h":40,"y":350,"x":289}},"name":"xor12","LABEL":"XOR","type":"xor"},"bizActivity3-227338447":{"CONDITION":"TRUE","style":{"bound":{"w":100,"h":30,"y":289,"x":458}},"HAS-ACTION":[],"name":"bizActivity3","ruleData":{},"LABEL":"活动环节3","type":"businessActivity","eventData":{}},"bizActivity1|xor6":{"targetNode":"xor63685179","style":{"targetNode":"xor63685179","inPortDir":0,"sourceNode":"bizActivity1-227338449","points":[{"y":106,"x":235},{"y":135.5,"x":235},{"y":135.5,"x":216},{"y":165,"x":216}],"outPortDir":2},"sourceNode":"bizActivity1-227338449","type":"connection","varIn":"x"},"bizActivity1|xor9":{"targetNode":"xor93685182","style":{"targetNode":"xor93685182","inPortDir":0,"sourceNode":"bizActivity1-227338449","points":[{"y":106,"x":235},{"y":137.5,"x":235},{"y":137.5,"x":308},{"y":169,"x":308}],"outPortDir":2},"sourceNode":"bizActivity1-227338449","type":"connection","varIn":"x"}}};
var livings = ['bizActivity10'];
var aborts = ['bizActivity1'];
var flowTrack = [['bizActivity1','bizActivity3'],['bizActivity3','bizActivity10']];
var backTrack=[];
var a = {livings:livings,flowTrack:flowTrack,backTrack:backTrack,livings:livings,aborts:aborts};
var trackData = {gMeta:baseGraphic,otherMeta:a};

/*************************************************************************/
var botData = [{id:1,ahead:[],next:[2],
 			   name:'标题的得到的的得到的1',
 			   executor:[{name:'标题的得到的的得到的2sub1',
			   executor:'王文岩',
			   executordepartment:'项目三组',
			   status:'测试状态2',
			   createtime:'2009-08-21 17:45:20',
			   executetime:'2009-08-21 17:55:20'},{name:'标题的得到的的得到的2sub1',
			   executor:'王文岩',
			   executordepartment:'项目三组',
			   status:'测试状态2',
			   createtime:'2009-08-21 17:45:20',
			   executetime:'2009-08-21 17:55:20'},{name:'标题的得到的的得到的2sub1',
			   executor:'王文岩',
			   executordepartment:'项目三组',
			   status:'测试状态2',
			   createtime:'2009-08-21 17:45:20',
			   executetime:'2009-08-21 17:55:20'},{name:'标题的得到的的得到的2sub1',
			   executor:'王文岩',
			   executordepartment:'项目三组',
			   status:'测试状态2',
			   createtime:'2009-08-21 17:45:20',
			   executetime:'2009-08-21 17:55:20'}],
 			   executordepartment:'项目三组',
 			   status:'测试状态1',
 			   createtime:'2009-08-21 17:45:20',
 			   executetime:'2009-08-21 17:55:20'},
			  {id:2,ahead:[1],next:[3,4],
			   name:'标题的得到的的得到的2',
			   executor:'王文岩',
			   executordepartment:'项目三组',
			   status:'测试状态2',
			   createtime:'2009-08-21 17:45:20',
			   executetime:'2009-08-21 17:55:20'},
			  {id:3,ahead:[2],next:[5],
			   name:'标题的得到的的得到的3',
			   executor:'王文岩',
			   executordepartment:'项目三组',
			   status:'测试状态3',
			   createtime:'2009-08-21 17:45:20',
			   executetime:'2009-08-21 17:55:20'},
			  {id:4,ahead:[2],next:[5],
			   name:'标题的得到的的得到的4',
			   executor:'王文岩',
			   executordepartment:'项目三组',
			   status:'测试状态4',
			   createtime:'2009-08-21 17:45:20',
			   executetime:'2009-08-21 17:55:20'},
			  {id:5,ahead:[3,4],next:[6,7,8],
			   name:'标题的得到的的得到的5',
			   executor:'王文岩',
			   executordepartment:'项目三组',
			   status:'测试状态5',
			   createtime:'2009-08-21 17:45:20',
			   executetime:'2009-08-21 17:55:20'},
			  {id:6,ahead:[5],next:[9],
			   name:'标题的得到的的得到的6',
			   executor:'王文岩',
			   executordepartment:'项目三组',
			   status:'测试状态6',
			   createtime:'2009-08-21 17:45:20',
			   executetime:'2009-08-21 17:55:20'},
			  {id:7,ahead:[5],next:[9],
			   name:'标题的得到的的得到的7',
			   executor:'王文岩',
			   executordepartment:'项目三组',
			   status:'测试状态7',
			   createtime:'2009-08-21 17:45:20',
			   executetime:'2009-08-21 17:55:20'},
			  {id:8,ahead:[5],next:[10],
			   name:'标题的得到的的得到的8',
			   executor:'王文岩',
			   executordepartment:'项目三组',
			   status:'测试状态8',
			   createtime:'2009-08-21 17:45:20',
			   executetime:'2009-08-21 17:55:20'},
			  {id:9,ahead:[6,7],next:[10],
			   name:'标题的得到的的得到的9',
			   executor:'王文岩',
			   executordepartment:'项目三组',
			   status:'测试状态9',
			   createtime:'2009-08-21 17:45:20',
			   executetime:'2009-08-21 17:55:20'},
			  {id:10,ahead:[8,9],next:[],
			   name:'标题的得到的的得到的10',
			   executor:'王文岩',
			   executordepartment:'项目三组',
			   status:'测试状态10',
			   createtime:'2009-08-21 17:45:20',
			   executetime:'2009-08-21 17:55:20'}
			 ];
			
//若要测试，请给以下两个变量重新赋值.
//trackData = {}		
//botData = [];			
			
			
			
