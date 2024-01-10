import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Form, Input, List, Modal } from 'antd';
import { toast } from 'react-hot-toast';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import Title from 'antd/es/typography/Title';
import { useUserId } from './hooks/useUserId';
import { createTodo, editIsCompleted, editTodo, getTodos, removeTodo } from './redux/Todo/todoSlice';

export const App = () => {
    useUserId();
    const dispatch = useDispatch();
    const { todos } = useSelector((state) => state.todo);

    useEffect(() => {
        dispatch(getTodos());
    }, [dispatch]);

    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [titleError, setTitleError] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredTodos, setFilteredTodos] = useState(todos);
    const [editTitleError, setEditTitleError] = useState(false);

    const onHandleSubmit = () => {
        const { title, text } = form.getFieldsValue();

        if (!title || title.trim().length < 2) {
            return setTitleError(true);
        }
        let newTodo = {};
        if (!text) {
            newTodo = {
                title: title.trim(),
            };
        } else {
            newTodo = {
                title: title.trim(),
                text: text.trim(),
            };
        }

        dispatch(createTodo({ ...newTodo })).then(({ payload }) => {
            if (payload.statusCode === 201) {
                toast.success('Todo created successfully');
                form.setFieldsValue({
                    title: '',
                    text: '',
                });
            } else if (payload.message[0] === 'title must be longer than or equal to 2 characters') setTitleError(true);
        });
    };

    const onChange = (id) => {
        dispatch(editIsCompleted(id)).then(({ payload }) => {
            if (payload.statusCode === 200) toast.success('Todo updated successfully');
        });
    };

    const onHandleDelete = (id) => {
        dispatch(removeTodo(id)).then(({ payload }) => {
            if (payload.data.statusCode === 200) toast.success('Todo deleted successfully');
        });
    };

    useEffect(() => {
        setFilteredTodos(todos);
    }, [todos]);

    const filterAll = () => {
        setFilteredTodos(todos);
    };
    const filterActive = () => {
        setFilteredTodos(todos.filter((todo) => !todo.isCompleted));
    };
    const filterCompleted = () => {
        setFilteredTodos(todos.filter((todo) => todo.isCompleted));
    };

    const handleOk = () => {
        const { editTitle, editText } = editForm.getFieldsValue();
        const id = editForm.getFieldValue('id');

        if (!editTitle || editTitle.trim().length < 2) {
            return setEditTitleError(true);
        }
        let newTodo = {};
        if (!editText) {
            newTodo = {
                title: editTitle.trim(),
            };
        } else {
            newTodo = {
                title: editTitle.trim(),
                text: editText.trim(),
            };
        }

        dispatch(editTodo({ newTodo, id })).then(({ payload }) => {
            if (payload.statusCode === 200) {
                toast.success('Todo updated successfully');
                setIsModalOpen(false);
            } else if (payload.message[0] === 'title must be longer than or equal to 2 characters')
                setEditTitleError(true);
        });
    };

    return (
        <div className="container">
            <Form
                onFinish={onHandleSubmit}
                form={form}
                layout="vertical">
                <Form.Item
                    validateStatus={titleError ? 'error' : 'validating'}
                    help={titleError ? 'Title must be longer or equal to 2 characters' : ''}
                    name={'title'}
                    label="Title"
                    required>
                    <Input
                        required
                        size="large"
                        placeholder="Title"
                        onChange={() => {
                            titleError ? setTitleError(false) : null;
                        }}
                    />
                </Form.Item>
                <Form.Item
                    name={'text'}
                    label="Text">
                    <Input
                        size="large"
                        placeholder="Text"
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        style={{
                            float: 'right',
                        }}
                        htmlType="submit"
                        type="primary">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <Title
                style={{
                    marginTop: 40,
                }}
                level={4}>
                Count: <b>{filteredTodos.length}</b>
            </Title>
            <div
                style={{
                    display: 'flex',
                    columnGap: 5,
                    justifyContent: 'center',
                    alignItems: 'end',
                    marginBottom: 10,
                }}>
                <Title
                    level={5}
                    style={{ marginRight: 'auto', paddingLeft: 10, marginBottom: 0 }}>
                    {filteredTodos.every((el) => el.isCompleted === true)
                        ? 'Completed'
                        : filteredTodos.every((el) => el.isCompleted === false)
                        ? 'Active'
                        : 'All'}
                </Title>
                <Button
                    type="primary"
                    className="all"
                    onClick={filterAll}>
                    All
                </Button>
                <Button
                    type="primary"
                    onClick={filterActive}>
                    Active
                </Button>
                <Button
                    type="primary"
                    className="completed"
                    onClick={filterCompleted}>
                    Completed
                </Button>
            </div>
            <List
                style={{ marginBottom: 40 }}
                bordered
                itemLayout="horizontal"
                dataSource={filteredTodos}
                renderItem={(item) => (
                    <List.Item
                        style={
                            item.isCompleted
                                ? {
                                      opacity: 0.5,
                                  }
                                : {}
                        }
                        actions={[
                            <Button
                                onClick={() => {
                                    setIsModalOpen(true);
                                    editForm.setFieldsValue({
                                        editTitle: item.title,
                                        editText: item.text,
                                        id: item.id,
                                    });
                                }}
                                type="primary">
                                <EditOutlined />
                            </Button>,
                            <Button
                                onClick={() => onHandleDelete(item.id)}
                                type="primary"
                                danger>
                                <DeleteOutlined />
                            </Button>,
                        ]}>
                        <Checkbox
                            checked={item.isCompleted}
                            onChange={() => onChange(item.id)}
                        />
                        <List.Item.Meta
                            title={<p>{item?.title}</p>}
                            description={item?.text}
                        />
                        <p>{item.createdAt.slice(0, 10)}</p>
                    </List.Item>
                )}
            />
            <Modal
                title={`Edit todo #${editForm.getFieldValue('id')}`}
                open={isModalOpen}
                onOk={handleOk}
                okText="Submit"
                footer={null}
                onCancel={() => setIsModalOpen(false)}>
                <Form
                    style={{ marginTop: 20 }}
                    form={editForm}
                    onFinish={handleOk}
                    layout="vertical">
                    <Form.Item
                        validateStatus={editTitleError ? 'error' : 'validating'}
                        help={editTitleError ? 'Title must be longer or equal to 2 characters' : ''}
                        name={'editTitle'}
                        label="Title"
                        required>
                        <Input
                            required
                            size="large"
                            placeholder="Title"
                            onChange={() => {
                                editTitleError ? setEditTitleError(false) : null;
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name={'editText'}
                        label="Text">
                        <Input
                            size="large"
                            placeholder="Text"
                        />
                    </Form.Item>
                    <Form.Item className="last-formItem">
                        <Button
                            style={{
                                float: 'right',
                            }}
                            htmlType="submit"
                            type="primary">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
