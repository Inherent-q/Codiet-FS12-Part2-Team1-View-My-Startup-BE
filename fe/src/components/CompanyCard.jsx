function CompanyCard({ company, rank }) {
  return (
    <tr className="cs-row">
      <td className="col-rank">
        <span className="rank">{rank}위</span>
      </td>
      <td className="col-name">
        <div className="company-info">
          {company.logo ? (
            <div
              className="company-logo"
              style={company.logoBg ? { backgroundColor: company.logoBg } : {}}
            >
              <img
                src={company.logo}
                alt={company.name}
                className={
                  company.logoMax ? 'logo-max' :
                  company.logoFull ? 'logo-full' :
                  company.logoContain ? 'logo-contain' : ''
                }
              />
            </div>
          ) : (
            <div className="company-logo">
              {company.logoInitial}
            </div>
          )}
          <span className="company-name">{company.name}</span>
        </div>
      </td>
      <td className="col-desc">
        <p className="company-desc">{company.description}</p>
      </td>
      <td className="col-category">
        <span className="category-badge">{company.category}</span>
      </td>
      <td className="col-my">
        <span className="count">{company.myCount.toLocaleString()}</span>
      </td>
      <td className="col-compare">
        <span className="count">{company.compareCount.toLocaleString()}</span>
      </td>
    </tr>
  );
}

export default CompanyCard;
