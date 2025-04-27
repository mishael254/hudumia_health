import React from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBIcon
} from 'mdb-react-ui-kit';

const StatisticsCard = ({ title, count, icon, iconColor, subtitle }) => {
  return (
    <MDBCard className="h-100">
      <MDBCardBody>
        <h5 className="mb-3">{title}</h5>
        <div className="card-content">
          <div className={`card-icon ${iconColor}`}>
            <MDBIcon fas icon={icon} />
          </div>
          <div className="card-stats">
            <div className="number">{count}</div>
            <div className="label">{subtitle}</div>
          </div>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default StatisticsCard;
