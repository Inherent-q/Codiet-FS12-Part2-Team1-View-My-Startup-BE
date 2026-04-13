import { useParams } from "react-router-dom";

const dummyData = [
  { id: 1, name: "기업 1", description: "설명 1" },
  { id: 2, name: "기업 2", description: "설명 2" },
];

function Detail() {
  const { id } = useParams();

  const company = dummyData.find(
    (item) => item.id === Number(id)
  );

  if (!company) return <div>기업 없음</div>;

  return (
    <div>
      <h1>{company.name}</h1>
      <p>{company.description}</p>
    </div>
  );
}

export default Detail;
