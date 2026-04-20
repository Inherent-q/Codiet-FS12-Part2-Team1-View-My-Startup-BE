function CompanyCard({ company, rank }) {
  const initial = company.name ? company.name[0] : '?';

  return (
    <tr className="cs-row">
      <td className="col-rank">
        <span className="rank">{rank}위</span>
      </td>
      <td className="col-name">
        <div className="company-info">
          {company.img ? (
            <div className="company-logo">
              <img
                src={company.img}
                alt={company.name}
                className="logo-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement.textContent = initial;
                }}
              />
            </div>
          ) : (
            <div className="company-logo">
              {initial}
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
        <span className="count">{Number(company.myCount).toLocaleString()}회</span>
      </td>
      <td className="col-compare">
        <span className="count">{Number(company.compareCount).toLocaleString()}회</span>
      </td>
    </tr>
  );
}

export default CompanyCard;
