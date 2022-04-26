import React, { useState, useEffect } from 'react';
import DatePicker from 'react-date-picker';
import { v4 as uuidv4 } from 'uuid';
import { deleteDoc, doc, setDoc, collection, getDocs, getDoc } from "firebase/firestore"; 
import { db, auth } from '../database'
import Item from './Item';
// import { setAnalyticsCollectionEnabled } from 'firebase/analytics';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
// import userEvent from '@testing-library/user-event';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

const WORKER_LINK = 'https://us-central1-automation-nk.cloudfunctions.net/ical?url=';

function List() {
    let [user] = useAuthState(auth);
    let [title, setTitle] = useState('');
    let [date, setDate] = useState(new Date());
    let [task, setTask] = useState([]);
    let [open, setOpen] = useState(false);
    let [link, setLink] = useState('');

    const collectionName = `users/${user.uid}/tasks`;

    function removeItem(data) {
        const result = task.filter((item) => item.id !== data.id);
        setTask(result);
        deleteDoc(doc(db, collectionName, data.id));
    }

    function onSubmit() {
        const obj = { id: uuidv4(), title: title, date: date };
        setTask([...task, obj]);
        setDoc(doc(db, collectionName, obj.id), obj);
        setTitle('');
    }

    function openModal() {
        setOpen(true);
    }

    async function saveLink() {
        await setDoc(doc(db, 'users', user.uid), {
            calendarurl: link,
        });
        setOpen(false);
    }

    async function bsSync() {
        const bsTasks = await fetch(WORKER_LINK + link).then((tasks) => tasks.json());
        let arr = task;
        bsTasks.forEach((task1) => {
            let foundMatch = false;
            task.forEach((item) => {
                if (item.title === task1.name && item.date.getTime() === new Date(task1.time).getTime()) foundMatch = true;
            });
            if (!foundMatch) {
                const obj = { id: uuidv4(), title: task1.name, date: new Date(task1.time) };
                console.log(obj, task1);
                setDoc(doc(db, collectionName, obj.id), obj);
                arr.push(obj);
            }
        });
        setTask([...arr]);
    }

    useEffect(() => {
        let newArr = [];
        getDocs(collection(db, collectionName)).then((tasks) => {
            tasks.forEach(task => {
                newArr.push( { 
                    title: task.data().title, 
                    date: new Date(task.data().date.seconds * 1000), 
                    id: task.data().id 
                });
            });
            setTask(newArr);
        });
        getDoc(doc(db, 'users', user.uid)).then((user) => {
            setLink(user.data().calendarurl || '');
        })
    });

    return (
        <div>
            <div className="header">
                <p className="user">Signed in as: {user.displayName} ({user.email}){' '}</p>
                <button className="logout-btn" onClick={() => {signOut(auth)}}>Log Out</button>
            </div>
            <h1>To-Do List</h1>
            <div className="inputs">
                <input type="text" value={title} onChange={event => setTitle(event.target.value)} />
                <DatePicker className="date" onChange={setDate} value={date} />
                <input type="submit" value="Add" onClick={onSubmit} />
                <input type="button" value="Get Brightspace Link" onClick={openModal} />
                <input type="button" value="Sync Calendar" onClick={bsSync}/>
                <h2>Tasks To Complete: {task.length}</h2>
                {task.map(data => (
                <Item key={data.id} itemData={data} removeItem={removeItem} />
                ))}
            </div>
            <Modal open={open} onClose={saveLink} center>
                <h2>Place Brightspace Link Here</h2>
                <input type="text" value={link} onChange={event => setLink(event.target.value)} />
            </Modal>
        </div>
    );
}

export default List;