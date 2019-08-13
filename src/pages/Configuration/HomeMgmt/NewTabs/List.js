import React from 'react';
import { connect } from 'dva';
import { Card, Table, Button, Form, Select, Tabs } from 'antd';
import moment from 'moment';
// import _ from 'lodash';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getColumns, mapDataToCols } from './listTable.config';
import NewestDialog from './NewestDialog';

const { Option } = Select;
const { TabPane } = Tabs;

const getTimeRange = () => {
  const day = 24 * 60 * 60 * 1000;
  const arrTime = new Array(7).fill('');
  const newArr = arrTime.map((eve, i) => ({ date: new Date().getTime() + day * i, id: i }));
  return newArr;
};

@connect(({ homemgmt, loading }) => ({
  homemgmt,
  loading: loading.models.homemgmt,
}))
@Form.create()
class List extends React.Component {
  state = { recoDialog: false, timeRange: getTimeRange(), recommendations: [] };

  componentDidMount() {
    this.loadNewests('APP');
  }

  loadNewests = channel => {
    const {
      dispatch,
      form: { getFieldValue },
    } = this.props;
    const recommendationDate = getFieldValue('recommendationDate');
    const params = {
      recommendationChannel: channel,
      recommendationDate,
    };
    dispatch({
      type: 'homemgmt/newestTabs',
      payload: params,
    });
  };

  handleClearForm = () => {
    const { form } = this.props;
    form.resetFields();
  };

  handleChangeTabs = v => {
    this.loadNewests(v);
  };

  handleSubmit = () => {
    const {
      dispatch,
      form: { getFieldValue },
    } = this.props;
    const recommendationDate = getFieldValue('recommendationDate');
    const params = {
      recommendationDate,
    };
    dispatch({
      type: 'homemgmt/publish',
      payload: params,
    });
  };

  handleAddRecommend = data => {
    const { recommendations } = this.state;
    recommendations.push(data);
    this.setState({ recommendations });
  };

  handleDeleteRecommend = data => {
    const { recommendations } = this.state;
    const newRecommend = recommendations.filter(key => key.recommendationId !== data.recommendationId);
    this.setState({ recommendations: newRecommend });
  };

  render() {
    const {
      homemgmt: { newests },
      form: { getFieldDecorator },
      loading,
    } = this.props;
    const { recoDialog, timeRange } = this.state;
    const tab = [{ name: 'WOOF APP', key: 'APP' }, { name: 'WOOF 小程序', key: 'APPLET' }];
    return (
      <PageHeaderWrapper title="最新Tab栏">
        <Tabs defaultActiveKey="APP" onTabClick={v => this.handleChangeTabs(v)}>
          {tab.map(eve => (
            <TabPane tab={eve.name} key={eve.key}>
              <Card bordered={false}>
                <Form layout="inline" style={{ marginBottom: 24 }}>
                  <Form.Item>
                    {getFieldDecorator('recommendationDate', {
                      initialValue: moment(new Date()).format('YYYY-MM-DD'),
                    })(
                      <Select style={{ width: 168 }}>
                        {timeRange.map(item => (
                          <Option value={moment(item.date).format('YYYY-MM-DD')} key={item.id}>
                            {item.id === 0 ? '当前' : moment(item.date).format('YYYY-MM-DD')}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button type="default" onClick={() => this.loadNewests()}>
                      立即发布
                    </Button>
                  </Form.Item>
                  <NewestDialog visible={recoDialog} />
                </Form>

                <Table
                  columns={getColumns(this.handleAddRecommend, this.handleDeleteRecommend)}
                  dataSource={mapDataToCols(newests)}
                  pagination={false}
                  align="center"
                  loading={loading}
                  rowKey="key"
                />
              </Card>
            </TabPane>
          ))}
        </Tabs>
      </PageHeaderWrapper>
    );
  }
}

export default List;
