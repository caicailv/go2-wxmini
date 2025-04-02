export const isPhone = (phone) => {
  return /^1[3456789][0-9]{1}\d{8}$/.test(phone);
};

export const getLocalTime = (ms, day) => {
  if (!ms) {
    return "";
  }
  ms = Number(ms);
  var _date = new Date(ms);
  var year = _date.getFullYear(),
    month = _date.getMonth() + 1,
    date = _date.getDate(),
    hour = _date.getHours(),
    minute = _date.getMinutes(),
    second = _date.getSeconds();
  return (
    year +
    "年" +
    (month < 10 ? "0" + month : month) +
    "月" +
    (date < 10 ? "0" + date : date) +
    "日" +
    (!day
      ? " " +
        (hour < 10 ? "0" + hour : hour) +
        ":" +
        (minute < 10 ? "0" + minute : minute) +
        ":" +
        (second < 10 ? "0" + second : second)
      : "")
  );
};
export const getLocalTimeTp = (ms, day) => {
  if (!ms) {
    return "";
  }
  ms = Number(ms);
  var _date = new Date(ms);
  var year = _date.getFullYear(),
    month = _date.getMonth() + 1,
    date = _date.getDate(),
    hour = _date.getHours(),
    minute = _date.getMinutes(),
    second = _date.getSeconds();
  return (
    year +
    "/" +
    (month < 10 ? "0" + month : month) +
    "/" +
    (date < 10 ? "0" + date : date) +
    (!day
      ? " " +
        (hour < 10 ? "0" + hour : hour) +
        ":" +
        (minute < 10 ? "0" + minute : minute) +
        ":" +
        (second < 10 ? "0" + second : second)
      : "")
  );
};

export const getTime = (time, ms) => {
  if (!time) {
    return "";
  }
  time = Number(time);
  var _date = new Date(time);
  var hour = _date.getHours(),
    minute = _date.getMinutes(),
    second = _date.getSeconds();

  return (
    (hour < 10 ? "0" + hour : hour) +
    ":" +
    (minute < 10 ? "0" + minute : minute) +
    (ms ? ":" + (second < 10 ? "0" + second : second) : "")
  );
};

export const getCloseDate = (dateNum) => {
  var minute = 1000 * 60,
    hour = minute * 60,
    day = hour * 24,
    halfamonth = day * 15,
    month = day * 30;

  var now = new Date().getTime(),
    diffValue = now - dateNum,
    monthC = diffValue / month,
    weekC = diffValue / (7 * day),
    dayC = diffValue / day,
    hourC = diffValue / hour,
    minC = diffValue / minute,
    result = "";

  if (monthC >= 1) {
    result = parseInt(monthC) + "个月前";
  } else if (weekC >= 1) {
    result = parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    result = parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    result = parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    result = parseInt(minC) + "分钟前";
  } else result = "刚刚";

  return result;
};

export const objectToQueryString = (obj) => {
  const params = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      params.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
    }
  }
  return params.join("&");
};

// 防抖函数
export const debounce = (fn, delay) => {
  let timeoutId = null;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

export const clearRegion = (val) => {
  let res = "";
  if (val[0] === val[1]) {
    res = val[0];
  } else {
    res = `${val[0]}${val[1]}`;
  }
  return res.replace("省", "").replace("市", "");
};

export const checkManage = (openid) => {
  const manages = [
    `orouA7ZQS-7OwNGQo8njKpYHKMiE`, //菜菜驴
    // `orouA7ZQS-7OwNGQo8njKpYHKMia`, //菜菜驴
    'orouA7dqjj8EEGA7DT8IgdwFxTeQ', //勾勾
  ];
  if (manages.includes(openid)) {
    return true;
  }

  return false;
};
