import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Table, Input, Button, Form, Select } from 'antd';
import { autobind } from 'core-decorators';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { columns, mapDataToCols } from './listTable.config';
import styles from './List.less';

const { Search } = Input;
const { Option } = Select;

@connect(({ material, loading }) => ({
  material,
  loading: loading.models.material,
}))
@Form.create({})
@autobind
class List extends React.Component {
  componentDidMount() {
    this.handleSearch(1);
  }

  handleClearForm = () => {
    const { form } = this.props;
    form.resetFields();
    this.handleSearch(1);
  };

  handleSearch(current = 1) {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'material/fetchList',
          payload: {
            current,
            size: 10,
            ...values,
          },
        });
      }
    });
  }

  render() {
    const {
      loading,
      material: { list = {} },
      form: { getFieldDecorator },
    } = this.props;
    const { records = [], total, pages, current } = list;
    const pagination = {
      onChange: this.handleSearch,
      total,
      current,
      showTotal: t => `${pages}页共${t}条`,
    };

    return (
      <PageHeaderWrapper title="全部素材">
        <Card bordered={false}>
          <Form layout="inline" style={{ marginBottom: 24 }}>
            <Form.Item>
              {getFieldDecorator('keyword', {
                initialValue: '',
              })(<Search style={{ width: 288 }} placeholder="请输入素材ID或素材名称" allowClear />)}
            </Form.Item>
            {/* <Form.Item>
              {getFieldDecorator('activityStatus', {
                initialValue: null,
              })(
                <Select style={{ width: 168 }}>
                  <Option value={null}>全部状态</Option>
                  <Option value="NOT_STARTED">未开始</Option>
                  <Option value="PROCESSING">进行中</Option>
                  <Option value="OVER">已结束</Option>
                </Select>
              )}
            </Form.Item> */}
            <Form.Item>
              <Button className={styles['btn-search']} type="primary" onClick={() => this.handleSearch()}>
                搜索
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={this.handleClearForm} type="default">
                清空
              </Button>
            </Form.Item>
            <Button
              className={styles['btn-new']}
              type="primary"
              icon="plus"
              onClick={() =>
                router.push({
                  pathname: '/activity/material/all/new',
                })
              }
            >
              新建素材
            </Button>
          </Form>

          <Table
            columns={columns}
            dataSource={mapDataToCols(records)}
            pagination={pagination}
            align="center"
            loading={loading}
            rowKey={record => record.id}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default List;
