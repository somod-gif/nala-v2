
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './InstantBook.css';
import {
  Button
} from 'react-bootstrap';
import cx from 'classnames';
import cs from '../../../commonStyle.css';

// Redux Form
import { Field, reduxForm, formValueSelector, change, submit as submitForm } from 'redux-form';

// Redux
import { connect } from 'react-redux';

// Locale
import messages from '../../../../locale/messages';

// Submit
import submit from '../../SearchForm/submit';

import Switch from '../../../Switch';

class InstantBook extends Component {

  static propTypes = {
    className: PropTypes.any,
    handleTabToggle: PropTypes.any,
    isExpand: PropTypes.bool
  };

  static defaultProps = {
    isExpand: false,
    fieldsSettingsData: {
      roomType: []
    },
    homeType: []
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.setBtnWrapperRef = this.setBtnWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  async handleSubmit() {
    const { className, handleTabToggle, isExpand, handleSubmit } = this.props;
    const { change, submitForm } = this.props;
    change('currentPage', 1);
    handleSubmit();
    handleTabToggle('instantBook', !isExpand)
  }

  handleReset() {
    const { className, handleTabToggle, isExpand } = this.props;
    const { change, submitForm } = this.props;
    change('bookingType', null);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  setBtnWrapperRef(node) {
    this.btnWrapperRef = node;
  }

  async handleClickOutside(event) {
    const { className, handleTabToggle, isExpand, handleSubmit } = this.props;
    const { change } = this.props;
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      change('currentPage', 1);
      handleSubmit();
      if (this.btnWrapperRef && !this.btnWrapperRef.contains(event.target)) {
        handleTabToggle('instantBook', !isExpand);
      }
    }
  }

  renderSwitch = ({ input, label, meta: { touched, error }, className, min, max, rangeCurrency }) => {
    const { formatMessage } = this.props.intl;
    const { change, bookingType } = this.props;

    return (
      <div>
        <Switch
          {...input}
          checked={bookingType == 'instant'}
          formName={'SearchForm'}
          fieldName={'bookingType'}
          checkedValue={'instant'}
          unCheckedValue={'request'}
        />
      </div>
    )
  }

  render() {
    const { className, handleTabToggle, isExpand, bookingType, filterIcon } = this.props;

    return (
      <div className={className}>
        <div ref={this.setBtnWrapperRef}>
          <Button
            className={cx({ [s.btnSecondary]: (isExpand === true || bookingType == 'instant') }, s.btn)}
            onClick={() => handleTabToggle('instantBook', !isExpand)}>
            <img src={filterIcon} className={cx('searchHeaderIcon', 'searchHeaderIconWidth')} />  <FormattedMessage {...messages.instantBook} />
          </Button>
        </div>
        {
          isExpand && <div className={cx(s.searchFilterPopover, 'searchFilterPopoverRTL')} ref={this.setWrapperRef}>
            <div className={s.searchFilterPopoverContent}>
              <div className={s.instaFlex}>
                <div>
                  <p className={cx(cs.commonMediumText, cs.fontWeightMedium)}>
                    <FormattedMessage {...messages.instantBook} />
                  </p>
                  <p className={cx(s.infoPadding, cs.commonMediumText, 'infoPaddingInstaRTL')}>
                    <FormattedMessage {...messages.instantBookInfo} />
                  </p>
                </div>
                <div className={cx('searchSwitch', 'directionLtr', s.switchTop)}>
                  <Field
                    name="bookingType"
                    component={this.renderSwitch}
                  />
                </div>
              </div>
              <div className={s.filterDivider}></div>
              <div className={cx(s.searchFilterPopoverFooter, s.displayTable)}>
                <div className={cx('text-left', s.displayTableCell)}>
                  {/* <Button
                    bsStyle="link"
                    className={cx(s.btnLink)}
                    onClick={this.handleReset}>
                    <FormattedMessage {...messages.clear} />
                  </Button> */}
                </div>
                <div className={cx(s.floatRight, 'floatLeftRTL')}>
                  <Button
                    bsStyle="link"
                    className={cx(s.btnLink, s.applyBtn)}
                    onClick={this.handleSubmit}>
                    <FormattedMessage {...messages.apply} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

InstantBook = reduxForm({
  form: 'SearchForm', // a unique name for this form
  onSubmit: submit,
  destroyOnUnmount: false,
})(InstantBook);

// Decorate with connect to read form values
const selector = formValueSelector('SearchForm'); // <-- same as form name

const mapState = (state) => ({
  fieldsSettingsData: state.listingFields.data,
  bookingType: selector(state, 'bookingType')
});

const mapDispatch = {
  change,
  submitForm
};

export default injectIntl(withStyles(s, cs)(connect(mapState, mapDispatch)(InstantBook)));