import React from 'react';
import { useSearchParams } from 'react-router-dom';

const ResultView = () => {
  let [searchParams, setSearchParams] = useSearchParams();

  console.log(searchParams.get('sid'));
  console.log(searchParams.get('uid'));

  return <div>ResultView</div>;
};

export default ResultView;
