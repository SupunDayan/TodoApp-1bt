export const getFormattedDate = (dateTime) => {
  const date = new Date(dateTime);
  const dueDateTimeYear = date.getFullYear();
  const dueDateTimeMonth = date.getMonth() + 1;
  const dueDateTimeDay = date.getDate();
  const dueDateTimeHours = date.getHours();
  const dueDateTimeMinutes = date.getMinutes();
  const dueDateTimeSeconds = date.getSeconds();

  return `${dueDateTimeYear.toString()}-${
    dueDateTimeMonth < 10
      ? "0" + dueDateTimeMonth.toString()
      : dueDateTimeMonth.toString()
  }-${
    dueDateTimeDay < 10
      ? "0" + dueDateTimeDay.toString()
      : dueDateTimeDay.toString()
  }T${
    dueDateTimeHours < 10
      ? "0" + dueDateTimeHours.toString()
      : dueDateTimeHours.toString()
  }:${
    dueDateTimeMinutes < 10
      ? "0" + dueDateTimeMinutes.toString()
      : dueDateTimeMinutes.toString()
  }:${
    dueDateTimeSeconds < 10
      ? "0" + dueDateTimeSeconds.toString()
      : dueDateTimeSeconds.toString()
  }`;
};
