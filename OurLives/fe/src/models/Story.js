const Story = {

  dateToString(date) {
    let retval = '';

    // Return if only decade is given
    // e.g. 90s
    if (!date.year && date.decade) {
      retval = `${date.decade}s`;
      return retval;
    }

    // Add the available year, month, day and time info of the date
    // in that specific order. Thus, there cannot be only the year and
    // the time but not the day or month
    if (date.year) {
      retval = date.year;
    }

    if (date.month && date.year) {
      retval = `${date.month} ${retval}`;
    }

    if (date.day && date.month && date.year) {
      retval = `${date.month} ${date.day}th, ${date.year}`;
    }

    if (date.day && date.month && date.year && date.time) {
      retval = `${date.time}, ${date.month} ${date.day}th, ${date.year}`;
    }

    return retval;
  },
};

export default Story;
