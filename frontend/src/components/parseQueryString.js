/**
 *
 * @param {string} string
 * @returns
 */
export const parseQueryString = (string) => {
  return string
    .slice(1)
    .split("&")
    .reduce((query, queryParams) => {
      let kvp = queryParams.split("=");
      let arrRegex = /([A-Za-z0-9]+)\[([A-Za-z0-9\-% ]+)\]/;
      if (arrRegex.test(kvp[0])) {
        arrRegex.lastIndex = 0;
        let match = arrRegex.exec(kvp[0]);
        if (query.hasOwnProperty(match[1])) {
          return {
            ...query,
            [match[1]]: [
              ...query[match[1]],
              {
                [match[2].replace("%20", " ")]:
                  kvp[1] === "true" || kvp[1] === "false"
                    ? kvp[1] === "true"
                    : kvp[1].replace("%20", " "),
              },
            ],
          };
        } else {
          return {
            ...query,
            [match[1]]: [
              {
                [match[2].replace("%20", " ")]:
                  kvp[1] === "true" || kvp[1] === "false"
                    ? kvp[1] === "true"
                    : kvp[1].replace("%20", " "),
              },
            ],
          };
        }
      } else {
        query[kvp[0]] = kvp[1];
        return query;
      }
    }, {});
};
