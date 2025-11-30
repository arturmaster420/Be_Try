
export const Weapons={
 pistol:{id:'pistol',fr:1,dm:1,n:1,sp:0},
 rifle:{id:'rifle',fr:1.8,dm:0.8,n:1,sp:0.05},
 shotgun:{id:'shotgun',fr:0.6,dm:0.9,n:6,sp:0.25},
 rocket:{id:'rocket',fr:0.5,dm:2,n:1,sp:0}
};
export function weaponForLvl(l){
 if(l>=15)return 'rocket';
 if(l>=10)return 'shotgun';
 if(l>=5)return 'rifle';
 return 'pistol';
}
