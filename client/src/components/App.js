import React, { Component } from 'react';
import Dashboard from './Dashboard';
import SignUp from './SignUp';
import 'whatwg-fetch';
import { Route, Redirect } from 'react-router-dom';
import HomePage from './HomePage';
import '../styles/App.css';
import Header from './Header';
import Footer from './Footer';
import Admin from './Admin';
import Settings from './Settings';
import { userAuth } from '../lib/DBAPI';

class App extends Component {
	state = {
		user: '',
		error: null,
		weekStart: '',
		loading: false
	};

	componentDidMount() {
		this.setCurrentWeek();
		this.localStorageUpdate();
	}

	localStorageUpdate = () => {
		if (this.state.user === '') {
			this.authenticateUser();
		} else {
			this.setState({ loading: true });
		}
	};

	async authenticateUser() {
		let res = await userAuth();
		if (res.success) this.setState({ user: res, loading: true });
		else this.setState({ loading: true });
	}

	setCurrentWeek = () => {
		const currentDate = new Date(Date.now());
		const weekBeginningDate =
			currentDate.getUTCDate() - currentDate.getUTCDay();
		const startOfDay = new Date(currentDate.setUTCDate(weekBeginningDate));
		startOfDay.setUTCHours(0, 0, 0, 0);
		this.setState({ weekStart: startOfDay.valueOf() });
	};

	changeWeek = shift => {
		this.setState(prevState => ({ weekStart: prevState.weekStart + shift }));
	};

	setUser = user => {
		this.setState({ user });
	};

	render() {
		const { user, weekStart, loading } = this.state;

		return (
			<div className='app'>
				<Header />
				{!loading && <div className='loading-bar' />}
				{loading && (
					<div className='page-content'>
						<Route
							path='/settings'
							render={() =>
								user.userRole === 'admin' || user.userRole === 'student' ? (
									<Settings
										user={user}
										validUser={user => this.setUser(user)}
									/>
								) : (
									<Redirect to='/' />
								)
							}
						/>
						<Route
							exact
							path='/'
							render={() =>
								user === '' ? (
									<HomePage validUser={user => this.setUser(user)} />
								) : user.userRole === 'admin' ? (
									<Redirect to='/admin' />
								) : ( user.userRole === 'student' ? (<Redirect to='/dashboard' />
                ) : (<Redirect to='/' />)
								)
							}
						/>
						<Route
							path='/admin'
							render={() =>
								user.userRole === 'admin' ? (
									<Admin
										validUser={user => this.setUser(user)}
										onWeekChange={timeChange => this.changeWeek(timeChange)}
										weekStart={weekStart}
										userRole={user.userRole}
										user={user}
									/>
								) : (
									<Redirect to='/' />
								)
							}
						/>
						<Route
							path='/dashboard'
							render={() =>
								user.userRole === 'student' ? (
									<Dashboard
										validUser={user => this.setUser(user)}
										onChangeWeek={timeChange => this.changeWeek(timeChange)}
										weekStart={weekStart}
										user={user}
									/>
								) : (
									<Redirect to='/' />
								)
							}
						/>
						<Route path='/signup' render={() => <SignUp user={user} />} />
					</div>
				)}
				<Footer />
			</div>
		);
	}
}

export default App;
