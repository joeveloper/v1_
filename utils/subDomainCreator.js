const createSubDomainName = name => {
  let subDomainName = name.replace(/ /g, '_');
  subDomainName = String(subDomainName).toLowerCase();
  return subDomainName;
};

export default createSubDomainName;
