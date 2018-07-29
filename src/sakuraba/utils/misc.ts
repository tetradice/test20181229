/** プレイヤーサイドを逆にする */
export function flipSide(side: PlayerSide): PlayerSide{
  if(side === 'p1') return 'p2';
  if(side === 'p2') return 'p1';
  return side;
}