import React from 'react';
import {
  Card,
  Button,
  List,
  Modal,
  Skeleton,
  Avatar,
  Select,
  Form,
  Input,
  DatePicker,
  notification,
  Badge,
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Lightbox from 'react-images';

import moment from 'moment';
import _ from 'lodash';

import styles from './Lists.less';

const FormItem = Form.Item;

@Form.create()
class Lists extends React.Component {
  state = {
    lightboxIsOpen: false,
    imgs: [],
    currentImage: 0,
    searchType: '0',
    evaluationCode: '',
    startApplyAt: '',
    endApplyAt: '',
    brandId: '',
    brands: [],
    seriesId: '',
    allSeries: [],
    series: [],
    evaluatorId: null,
    evaluators: [],
    evaluationResultTypeEnum: null,
    showUpdataModal: false,
    currentItem: null,
  };

  componentDidMount() {
    this.goToPage(0, 20);
    this.loadBrands();
    this.loadEvaluators();
  }

  loadBrands = async () => {
    const { dispatch } = this.props;
    const response = await dispatch({
      type: 'requirement/searchBrands',
      payload: {
        pageBar: {
          pageIndex: 0,
          pageSize: 20,
        },
      },
    });
    this.setState({
      brands: this.handleGetBrands(response),
      allSeries: _.get(response, 'data.productClassIfications', []),
    });
  };


  handleGetBrands = (response) => {
    let NewBrands = [];
    if (_.has(response, 'data.productBrands')) {
      const shoes = response.data.productBrands.sort((a, b) => a.name.localeCompare(b.name)).filter(item => item.productType.code === '1')
      NewBrands = shoes.concat(response.data.productBrands.sort((a, b) => a.name.localeCompare(b.name)).filter(item => item.productType.code !== '1'))
    }
    return NewBrands;
  }

  loadEvaluators = async () => {
    const { dispatch } = this.props;
    const response = await dispatch({
      type: 'requirement/searchEvaluators',
      payload: {
        pageBar: {
          pageIndex: 0,
          pageSize: 20,
        },
      },
    });
    this.setState({
      evaluators: _.get(response, 'data.evaluators', []),
    });
  };

  goToPage = async (page, size) => {
    const { dispatch } = this.props;
    const {
      searchType,
      searchKeyword,
      startApplyAt,
      endApplyAt,
      brandId,
      seriesId,
      evaluatorId,
      evaluationResultTypeEnum,
    } = this.state;

    const payload = {
      searchType,
      searchKeyword,
      startApplyAt,
      endApplyAt,
      brandId,
      seriesId,
      evaluatorId,
      evaluationResultTypeEnum,
      pageBar: {
        pageIndex: page > 0 ? page - 1 : page,
        pageSize: size,
      },
    };

    await dispatch({
      type: 'requirement/searchEvalOrders',
      payload
      // payload: {
      //   pageBar: {
      //     pageIndex: page > 0 ? page - 1 : page,
      //     pageSize: size,
      //   },
      // },
    });
  };

  /** 展示鉴定结果列表 */
  showEvaluationRecords = (records) => {
    var result = "";
    if (records != null && records.length > 0) {
      return <div>
        {records.map(item =>
          <p key={item.evaluationId}>{item.evaluatorName + "    " + item.evaluationResult.message} </p>
        )}
      </div>
    }
    return result;
  };

  handleSearch = () => {
    const { dispatch } = this.props;
    if (_.isEmpty(this.state.searchKeyword)) {
      notification.error({ message: '搜索内容不能为空' });
      return;
    }
    const {
      searchType,
      searchKeyword,
      startApplyAt,
      endApplyAt,
      brandId,
      seriesId,
      evaluatorId,
      evaluationResultTypeEnum,
    } = this.state;

    const payload = {
      searchType,
      searchKeyword,
      startApplyAt,
      endApplyAt,
      brandId,
      seriesId,
      evaluatorId,
      evaluationResultTypeEnum,
      pageBar: {
        pageIndex: 0,
        pageSize: 20,
      },
    };

    dispatch({
      type: 'requirement/searchEvalOrders',
      payload,
    });
  };

  createActionBtn = item => [
    <Button icon="edit" onClick={() => this.showModal(item)}>
      纠错
    </Button>,
  ];

  handleChangeSearchType = val => {
    this.setState({ searchType: val });
  };

  handleChangeSearchKeyword = e => {
    this.setState({ searchKeyword: e.target.value });
  };

  handleChangeBrand = v => {
    const { dispatch } = this.props;
    this.setState({ brandId: v });
    this.setState({ series: this.state.allSeries.filter(ele => ele.brandId === v) });

    dispatch({
      type: 'requirement/searchEvalOrders',
      payload: {
        ...this.state,
        brandId: v,
        pageBar: {
          pageIndex: 0,
          pageSize: 20,
        }
      },
    });
  };

  handleChangeSeries = v => {
    const { dispatch } = this.props;
    this.setState({ seriesId: v });

    dispatch({
      type: 'requirement/searchEvalOrders',
      payload: {
        ...this.state,
        seriesId: v,
        pageBar: {
          pageIndex: 0,
          pageSize: 20,
        }
      },
    });
  };

  handleDateChange = v => {
    const { dispatch } = this.props;
    this.setState({
      startApplyAt: v[0].format('YYYY-MM-DD HH:mm:ss'),
      endApplyAt: v[1].format('YYYY-MM-DD HH:mm:ss'),
    });

    dispatch({
      type: 'requirement/searchEvalOrders',
      payload: {
        ...this.state,
        startApplyAt: v[0].format('YYYY-MM-DD HH:mm:ss'),
        endApplyAt: v[1].format('YYYY-MM-DD HH:mm:ss'),
        pageBar: {
          pageIndex: 0,
          pageSize: 20,
        }
      },
    });
  };

  handleChangeSearchState = v => {
    const { dispatch } = this.props;
    this.setState({ evaluationResultTypeEnum: v });
    dispatch({
      type: 'requirement/searchEvalOrders',
      payload: {
        ...this.state,
        evaluationResultTypeEnum: v,
        pageBar: {
          pageIndex: 0,
          pageSize: 20,
        }
      },
    });
  };

  handleChangeEvaluator = v => {
    const { dispatch } = this.props;
    this.setState({ evaluatorId: v });

    dispatch({
      type: 'requirement/searchEvalOrders',
      payload: {
        ...this.state,
        evaluatorId: v,
        pageBar: {
          pageIndex: 0,
          pageSize: 20,
        }
      },
    });
  };

  //图片展示相关方法
  showImg = item => {
    let imgs = item.multimedias.map(item => ({ src: item.url }));
    this.setState({
      lightboxIsOpen: true,
      imgs: imgs,
    });
  };

  gotoPrevious = () => {
    this.setState({
      currentImage: this.state.currentImage - 1,
    });
  };
  gotoNext = () => {
    this.setState({
      currentImage: this.state.currentImage + 1,
    });
  };
  gotoImage = index => {
    this.setState({
      currentImage: index,
    });
  };

  handleClickImage = () => {
    if (this.state.currentImage === this.state.imgs.length - 1) return;
    this.gotoNext();
  };

  closeLightbox = () => {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false,
    });
  };

  genStatus = val => {
    return ['', '待领取', '正在鉴定'][val];
  };

  //纠错弹框
  showModal = item => {
    this.setState({
      currentItem: item,
      showUpdataModal: true,
    });
  };

  handleOk = e => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;

    //验证并触发action
    validateFieldsAndScroll(async (error, values) => {
      if (error) return;
      await dispatch({
        type: 'requirement/correct',
        payload: { ...{ evaluationCode: this.state.currentItem.evaluationCode }, ...values },
      });
      // this.handleSearch();
      this.goToPage(1, 20);
      this.setState({
        showUpdataModal: false,
      });
    });
  };

  handleCancel = e => {
    this.setState({
      showUpdataModal: false,
    });
  };



  renderSimpleForm = () => {
    return (
      <div>
        <Form layout="inline">
          <Form.Item>
            <Select
              placeholder="选择状态"
              style={{ width: '100px' }}
              value={this.state.searchType}
              onChange={this.handleChangeSearchType}
            >
              <Select.Option value="0">鉴定码</Select.Option>
              <Select.Option value="1">用户昵称</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Input
              placeholder="鉴定码/昵称"
              value={this.state.searchKeyword}
              onChange={this.handleChangeSearchKeyword}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={this.handleSearch} type="primary" icon="search">
              搜索
            </Button>
          </Form.Item>
        </Form>
        <Form layout="inline">
          <Form.Item>
            <Select
              placeholder="选择品牌"
              style={{ width: '120px' }}
              value={this.state.brandId}
              onChange={this.handleChangeBrand}
            >
              <Select.Option value="">所有品牌</Select.Option>
              {this.state.brands.map(option => (
                <Select.Option key={option.id} value={option.id}>
                  {`${option.name} (${option.productType.message})`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Select
              placeholder="选择系列"
              style={{ width: '120px' }}
              value={this.state.seriesId}
              onChange={this.handleChangeSeries}
            >
              <Select.Option value="">所有系列</Select.Option>
              {this.state.series.map(option => (
                <Select.Option key={option.id} value={option.id}>
                  {option.classificationType.code !== '1' ? '暂无系列' : option.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Select
              placeholder="选择鉴定师"
              style={{ width: '120px' }}
              value={this.state.evaluatorId}
              onChange={this.handleChangeEvaluator}
            >
              <Select.Option value={null}>所有鉴定师</Select.Option>
              {this.state.evaluators.map(option => (
                <Select.Option key={option.id} value={option.evaluatorId}>
                  {option.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <DatePicker.RangePicker
              showTime
              defaultValue={[
                moment(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                moment(new Date(), 'YYYY-MM-DD HH:mm:ss'),
              ]}
              format={'YYYY-MM-DD HH:mm:ss'}
              onOk={this.handleDateChange}
            />
          </Form.Item>
          <Form.Item>
            <Select
              placeholder="选择状态"
              style={{ width: '120px' }}
              onChange={this.handleChangeSearchState}
            >
              <Select.Option value="">选择所有状态</Select.Option>
              <Select.Option value="1">待鉴定</Select.Option>
              <Select.Option value="2">开放鉴定中</Select.Option>
              <Select.Option value="3">封闭鉴定中</Select.Option>
              <Select.Option value="4">待补充</Select.Option>
              <Select.Option value="5">等待仲裁</Select.Option>
              <Select.Option value="6">仲裁中</Select.Option>
              <Select.Option value="7">无法受理</Select.Option>
              <Select.Option value="8">鉴定完成</Select.Option>
              <Select.Option value="9">鉴定关闭</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </div>
    );
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { requirement } = this.props;
    const { data, loading } = requirement;
    const { evaluationOrderResults, pageBar } = data;
    const { dataCount = 0, pageIndex = 1, pageSize = 20 } = pageBar || {};
    return (
      <PageHeaderWrapper title="需求列表">
        <Card>
          <div className={styles.header}>{this.renderSimpleForm()}</div>
          <List
            itemLayout="horizontal"
            size="large"
            dataSource={evaluationOrderResults}
            pagination={{
              total: dataCount || 0,
              current: pageIndex + 1 || 1,
              showSizeChanger: true,
              onChange: this.goToPage,
              onShowSizeChange: this.goToPage,
              pageSizeOptions: ['20'],
              pageSize: pageSize,
            }}
            bordered
            loading={loading}
            renderItem={item => (
              <List.Item actions={this.createActionBtn(item)}>
                <Skeleton avatar title={false} loading={item.loading} active>
                  <div style={{ flex: 8 }}>
                    <p>
                      <a onClick={() => router.push(`/eval/users/users/edit/${item.customerId}`)}>
                        {item.customerName}
                      </a>
                    </p>
                    {moment(Date.parse(item.applyAt)).format('YYYY/MM/DD HH:MM')} 创建的 {item.evaluationCode}{' '}
                    {this.genStatus(item.processStatus)}
                    <p>
                      {item.brandName} / {item.seriesName}
                    </p>
                    {
                      this.showEvaluationRecords(item.evaluationRecords)
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <Badge count={item.multimedias.length}>
                      <Avatar
                        shape="square"
                        size={64}
                        src={item.mainImage}
                        onClick={() => this.showImg(item)}
                      />
                    </Badge>
                  </div>
                </Skeleton>
              </List.Item>
            )}
          />
        </Card>
        <Lightbox
          images={this.state.imgs}
          currentImage={this.state.currentImage}
          isOpen={this.state.lightboxIsOpen}
          onClickImage={this.handleClickImage}
          onClickNext={this.gotoNext}
          onClickPrev={this.gotoPrevious}
          onClose={this.closeLightbox}
        />
        <Modal
          title="纠错"
          visible={this.state.showUpdataModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose
        >
          <Form hideRequiredMark>
            <FormItem label="品牌">
              {getFieldDecorator('brandId', {
                rules: [{ required: true, message: '品牌为必填' }],
              })(
                <Select
                  placeholder="请选择品牌"
                  onChange={v => {
                    this.setState({
                      series: this.state.allSeries.filter(ele => ele.brandId === v),
                    });
                  }}
                >
                  {this.state.brands.map(option => (
                    <Select.Option key={option.id} value={option.id}>
                      {`${option.name} (${option.productType.message})`}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="系列">
              {getFieldDecorator('seriesId', {
                rules: [{ required: true, message: '系列为必填' }],
              })(
                <Select placeholder="请选择系列">
                  {this.state.series.map(option => (
                    <Select.Option key={option.id} value={option.id}>
                      {option.classificationType.code !== '1' ? '暂无系列' : option.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ requirement }) => ({
  requirement,
}))(Lists);
