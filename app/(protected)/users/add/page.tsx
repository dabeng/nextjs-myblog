import { AddEdit } from '_components/users';
/*
* The add user page simply renders the add/edit user component without any user specified so the
* component is set to "add" mode.
*/
export default Add;

function Add() {
    return <AddEdit title="Add User" />;
}