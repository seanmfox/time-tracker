import React, { Component } from 'react';
import { VictoryPie } from 'victory';
import { timeOutput } from '../lib/timeOutput';
import addActivity from '../images/add_activity.svg';

class WeeklyRecap extends Component {
	currentActivities = (activities, weekStart) => {
		const currentWeekActivities = activities.filter(
			activity =>
				weekStart <= new Date(activity.date).valueOf() &&
				new Date(activity.date).valueOf() < weekStart + 604800000
		);
		return currentWeekActivities;
	};

	render() {
		const { activities, weekStart, userRole } = this.props;
		const weeklyActivityList = this.currentActivities(activities, weekStart);
		const activitiesTypeList = [
			...new Set(weeklyActivityList.map(activity => activity.activityType))
		];
		const weekBeginningDate = new Date(weekStart).toLocaleDateString('en-US', {
			timeZone: 'UTC',
			month: 'long',
			day: 'numeric'
		});
		const weekEndDate = new Date(weekStart + 604800000 - 1).toLocaleDateString(
			'en-US',
			{ timeZone: 'UTC', month: 'long', day: 'numeric' }
		);

		const chartData = activitiesTypeList.map(type => {
			const totalTime = weeklyActivityList
				.filter(activity => activity.activityType === type)
				.reduce((acc, curr) => acc + curr.time, 0);
			return { x: type, y: totalTime };
		});

		return (
			<div className='weekly-recap'>
				<h2 className='weekly-recap-heading'>
					Weekly Recap
					{userRole === 'admin' && (
						<span>
							{' '}
							- {weekBeginningDate} - {weekEndDate}
						</span>
					)}
				</h2>
				<hr />
				{activitiesTypeList.length > 0 ? (
					<>
						<table className='recap-table'>
							<tbody>
								<tr className='table-header-row'>
									<th className='table-data'>Type</th>
									<th className='table-data'>Total Duration</th>
								</tr>
								{activitiesTypeList.map(type => (
									<tr className='type-recap' key={type}>
										<td className='type-name'>{type}</td>
										<td className='type-duration'>
											{timeOutput(
												weeklyActivityList
													.filter(activity => activity.activityType === type)
													.reduce((acc, curr) => acc + curr.time, 0)
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
            <VictoryPie 
              data={chartData} 
              colorScale={['#016d0e', '#3d8536', '#639e59', '#87b77d', '#abd0a2', '#cfeac8']} 
              padding={{left: 100, right: 100}} 
              height={275}
            />
					</>
				) : (
					<div className='no-activity'>
						<img
							className='add-activity'
							src={addActivity}
							alt='Add an activity'
						/>
						<p>No Activities Tracked This Week</p>
					</div>
				)}
			</div>
		);
	}
}

export default WeeklyRecap;
