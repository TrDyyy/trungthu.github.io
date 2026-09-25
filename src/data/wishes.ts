import { Wish } from '../types/wish';

export const DEFAULT_WISHES: Wish[] = [
  {
    id: 'default-1',
    name: 'Hà Nội',
    message: 'Mong mọi người một mùa Trung Thu thật ấm áp, bên những người thân yêu.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'default-2',
    name: 'Bình',
    message: 'Mong gia đình luôn bình an và hạnh phúc, dù ở bất cứ đâu.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'default-3',
    name: 'Linh',
    message: 'Mong những người đang ở xa sớm được trở về nhà, quây quần bên mâm cỗ trăng rằm.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'default-4',
    name: 'Tuấn',
    message: 'Chúc bạn luôn giữ được những niềm vui nhỏ bé trong cuộc sống.',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'default-5',
    message: 'Mong mọi điều dịu dàng sẽ tìm đến bạn đúng lúc bạn cần nhất.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'default-6',
    name: 'Mai',
    message: 'Một đêm trăng sáng, một tách trà ấm, và những người bạn yêu quý bên cạnh — mong bạn có được điều đó.',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 'default-7',
    name: 'Duy',
    message: 'Trăng vẫn tròn mỗi năm, mong chúng ta đều bình an để gặp lại nhau.',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'default-8',
    name: 'Ngọc',
    message: 'Chúc em bé trong nhà luôn vui, luôn khỏe, và ăn bánh nướng thật ngon đêm nay.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

export const MOON_MESSAGES: string[] = [
  'Một điều tốt đẹp đang trên đường tìm đến bạn.',
  'Ánh trăng chứng kiến tất cả nỗ lực của bạn. Đừng bỏ cuộc.',
  'Hôm nay, hãy nhớ gọi điện cho người bạn nhớ.',
  'Có những khoảnh khắc nhỏ bé đang chờ bạn nhận ra.',
  'Bạn xứng đáng được yêu thương hơn bạn nghĩ.',
  'Đêm nay trăng sáng, mong lòng bạn cũng nhẹ nhàng.',
  'Những điều chậm rãi thường là những điều tốt nhất.',
  'Trăng rằm nhắc nhở: mỗi điều tốt đẹp đều đáng được trân trọng.',
  'Hãy tha thứ cho bản thân về những điều đã qua.',
  'Điều bạn đang tìm kiếm cũng đang tìm kiếm bạn.',
  'Đêm nay, hãy ăn một miếng bánh Trung Thu và mỉm cười.',
  'Ánh trăng chạm đến tất cả mọi người như nhau — dù ở bất cứ đâu.',
  'Cuộc sống đang dịu dàng hơn bạn nhận ra.',
  'Hãy để lòng mình nhẹ như chiếc đèn lồng trôi lên trời.',
  'Mong bạn và những người bạn yêu đều đang bình an đêm nay.',
  'Điều ước của bạn đã được ánh trăng lắng nghe.',
  'Năm nay có thể chưa hoàn hảo, nhưng bạn vẫn đang đứng vững.',
  'Trăng rằm là lời nhắc: dù xa cách, chúng ta vẫn nhìn chung một bầu trời.',
  'Những điều nhỏ bé mới là điều đáng nhớ nhất.',
  'Mong khoảnh khắc này trở thành ký ức ấm áp bạn nhớ mãi.',
];

export const STORAGE_KEY = 'mid_autumn_wishes';
export const MAX_WISHES = 50;

export const MID_AUTUMN_DATE = new Date('2026-10-01T00:00:00+07:00');
