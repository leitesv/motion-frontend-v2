import React from "react";
import { connect } from "react-redux";
// import { mapStateToProps } from './mappers';


const HeadingModule = (props) => {

    return (
        <>
            <div className="zl_all_page_heading_section">
                <div className="zl_all_page_heading">
                    <h2>{props.name}</h2>
                    <p>Qredit Motion</p>
                </div>
            </div>
        </>
    );
}

export default connect(null, null)(HeadingModule);
