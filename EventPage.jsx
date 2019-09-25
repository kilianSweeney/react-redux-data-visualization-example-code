import React from 'react';
import { connect } from 'react-redux';
import { briefActions } from '../_actions';
import {Carousel} from 'react-bootstrap';
import {
    EventSummary,
    EventCompanyRegistrations,
    EventROIRevenue,
    EventSocialMetrics,
    EventStats,
    EventDetails,
    ExperienceScoreGraph,
    EngagementCampaigns,
    EngagementSurvey,
    EngagementWebActivity,
    ScorecardRegistration,
    Sessions,
    Programs,
    InvitationsGraph,
    InvitationsValueGraph,
    RegistrationFeesGraph,
    HotelBlockGraph,
    EventPacingGraph,
    EventRegBreakdownGraph,
    SponsorshipRevenueGraph,
    HotelPickup,
    LongText
} from '../_components';
import Swipeable from 'react-swipeable';
import moment from 'moment';

import '../styles/animate.css';
import '../styles/footer.css';
import '../styles/list.css';
import '../styles/event-page.css';
import '../styles/third-party.css';

class EventPage extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
          tab: 1,
          tabSlide1: 1,
          tabSlide2: 1,
          tabSlide3: 1,
          lastSwipeList:{
            tab1:3,
            tab2:4,
            tab3:3
          },
          firstSwipeList:{
            tab1:1,
            tab2:1,
            tab3:1
          },
          configurableSlidesInOrder:[
            [
                [2,'Sessions',true],
                [3,'Programs',true]
            ],
            [
                [2,'Invitations',true],
                [3,'Financials',true],
                [4,'Hotels',true]
            ],
            [
                [1,'Engagement',true],
                [2,'Survey',true],
                [3,'Email Campaign',true]
            ]  
          ],
          swipeListUpdated:false,
          slideMenuOpened1: false,
          slideMenuOpened2: false,
          slideMenuOpened3: false,
          sessionsRequested: false,
          programsRequested: false,
          registrationRequested: false,
          companyRegistrationsRequested: false,
          sponsorshipRevenueRequested:false,
          surveyRequested:false,
          campaignsRequested:false,
          hotelsRequested:false,
          id: ''
      };
        this.onWebActivityDateRangeChange = this.onWebActivityDateRangeChange.bind(this);
    }
    
    eventNowClicked(){
        if(!this.state.registrationRequested){
            this.props.dispatch(briefActions.getEventPacing(this.state.id));
            this.props.dispatch(briefActions.getEventRegistrationBreakdown(this.state.id));
            this.setState({registrationRequested:true});
        } 
        this.setState({tab:2});
    }
    
    engagementClicked(){
        if(!this.isSectionEnabled(2,'Engagement')){
            var firstSwipeList = this.state.firstSwipeList;
            
            if(!this.isSectionEnabled(2,'Survey')){
                this.state.tabSlide3 = 3;
                firstSwipeList.tab3 = 3;
                this.setState({firstSwipeList:firstSwipeList});
                if(!this.state.campaignsRequested){
                    this.props.dispatch(briefActions.getEngagementCampaigns(this.state.id));
                    this.setState({campaignsRequested:true});
                }
            }
            else {
                this.setState({tabSlide3:2});
                firstSwipeList.tab3 = 2;
                this.setState({firstSwipeList:firstSwipeList});
                if(!this.state.surveyRequested){
                    this.props.dispatch(briefActions.getEngagementSurvey(this.state.id));
                    this.setState({surveyRequested:true});
                }
            }
        }
        this.setState({tab:3});
    }
    
    detailsClicked(){
        this.setState({tab:4});
    }
    
    switchSlides(e,nextSlide){
        const slideProp = 'tabSlide' + this.state.tab;
        
        if(this.state.tab === 1 && nextSlide === 2 && !this.state.sessionsRequested){
            this.props.dispatch(briefActions.getSessions(this.state.id));
            this.setState({sessionsRequested:true});
        }
        
        if(this.state.tab === 1 && nextSlide === 3 && !this.state.programsRequested){
            this.props.dispatch(briefActions.getPrograms(this.state.id));
            this.setState({programsRequested:true});
        }
        if(this.state.tab === 2 && nextSlide === 3 && !this.state.sponsorshipRevenueRequested){
            this.props.dispatch(briefActions.getSponsorshipRevenue(this.state.id));
            this.setState({sponsorshipRevenueRequested:true});
        }
        if(this.state.tab === 2 && nextSlide === 4 && !this.state.hotelsRequested){
            this.props.dispatch(briefActions.getHotelBlocks(this.state.id));
            this.props.dispatch(briefActions.getHotelPickup(this.state.id));
            this.setState({hotelsRequested:true});
        }
        if(this.state.tab === 3 && nextSlide === 2 && !this.state.surveyRequested){
            this.props.dispatch(briefActions.getEngagementSurvey(this.state.id));
            this.setState({surveyRequested:true});
        }
        if(this.state.tab === 3 && nextSlide === 3 && !this.state.campaignsRequested){
            this.props.dispatch(briefActions.getEngagementCampaigns(this.state.id));
            this.setState({campaignsRequested:true});
        }
        
        
        this.setState({ [slideProp] : nextSlide });
        if(e !== null)this.toggleSlideMenu();
    }

    toggleSlideMenu(){
        const menuProp = 'slideMenuOpened' + this.state.tab;
        const isItOpened = this.state[menuProp];
        this.setState({ [menuProp]: !isItOpened });
    }
    
    onWebActivityDateRangeChange(event){
        if(event.target.value === "0")return;
        const rangeItems = event.target.value.split('-'),
            currentDate = moment(),
            rangeDates = [null,moment(currentDate).format('YYYY-MM-DD')];
        rangeDates[0] = moment(currentDate).subtract(rangeItems[0],rangeItems[1]).format('YYYY-MM-DD');
        this.props.dispatch(briefActions.getEngagementWebActivity(this.state.id,rangeDates));
    }
    
    isSectionEnabled(tabIndex,section){
        const rtrnBool = false;
        this.state.configurableSlidesInOrder[tabIndex].map((item,index) => {
            if(item[1]===section)rtrnBool = item[2];  
        });
        return rtrnBool;
    }
    
    getSectionLabel(tabIndex,section){
        const label = section;
        this.state.configurableSlidesInOrder[tabIndex].map((item,index) => {
            if(item[1]===section)label = item[3] ? item[3] : section;  
        });
        return label;
    }

    onSwiped(direction,e) {
        if(this.props.eventConfiguration === undefined || this.props.eventConfiguration.sections === undefined){
            return;
        }
        
        const slideProp = 'tabSlide' + this.state.tab,
            firstSwipe = 'tab' + this.state.tab, 
            app = this,
            setByConfig = function(section,slide){
                if(!app.isSectionEnabled(app.state.tab-1,section)){
                    if(direction === 'LEFT')slide++;
                    else slide--;
                }
            return slide;
            },
          resetSlide = function(slide){
            const slidesInOrder= app.state.configurableSlidesInOrder;
             if(direction === 'RIGHT'){
                 slidesInOrder[0].reverse();
                 slidesInOrder[1].reverse();
                 slidesInOrder[2].reverse();
             }
            if(app.state.tab === 1 && slide === slidesInOrder[0][0][0]){
                slide = setByConfig(slidesInOrder[0][0][1],slide);
            }
            if(app.state.tab === 1 && slide === slidesInOrder[0][1][0]){
                slide = setByConfig(slidesInOrder[0][1][1],slide);
            }
            if(app.state.tab === 2 && slide === slidesInOrder[1][0][0]){
                slide = setByConfig(slidesInOrder[1][0][1],slide);
            }
            if(app.state.tab === 2 && slide === slidesInOrder[1][1][0]){
                slide = setByConfig(slidesInOrder[1][1][1],slide);
            }
            if(app.state.tab === 2 && slide === slidesInOrder[1][2][0]){
                slide = setByConfig(slidesInOrder[1][2][1],slide);
            }
            if(app.state.tab === 3 && slide === slidesInOrder[2][0][0]){
                slide = setByConfig(slidesInOrder[2][0][1],slide);
            }
            if(app.state.tab === 3 && slide === slidesInOrder[2][1][0]){
                slide = setByConfig(slidesInOrder[2][1][1],slide);
            }
            if(app.state.tab === 3 && slide === slidesInOrder[2][2][0]){
                slide = setByConfig(slidesInOrder[2][2][1],slide);
            }
              return slide;
          };
        
        if(['TH','TD'].indexOf(e.target.nodeName) > -1)return;
        const lastSlide = this.state.lastSwipeList['tab' + this.state.tab];
        
        let nextSlide;
        if(direction === 'LEFT'){
            if(this.state[slideProp] + 1 > lastSlide)nextSlide = this.state.firstSwipeList[firstSwipe];
            else nextSlide = this.state[slideProp] + 1;
        }
        else {
           if(this.state[slideProp] - 1 < this.state.firstSwipeList[firstSwipe])nextSlide = lastSlide;
            else nextSlide = this.state[slideProp] - 1;
        }
        
        nextSlide = resetSlide(nextSlide);
        
        if(direction === 'LEFT'){
            if(nextSlide > lastSlide)nextSlide = this.state.firstSwipeList[firstSwipe];
       }
        else {
           if(nextSlide < this.state.firstSwipeList[firstSwipe])nextSlide = lastSlide;
        } 
        
        this.switchSlides(null,nextSlide);
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({id: id});
        this.props.dispatch(briefActions.getOne(id));
        this.props.dispatch(briefActions.getEventConfiguration(id));
    }
    
    
    componentDidUpdate(prevProps, prevState) {
        var updateLastSwipeList = function(app){
            var tmpSection,
                lastSwipeList = app.state.lastSwipeList,
                configurableSlidesInOrder = app.state.configurableSlidesInOrder,
                setConfigurableSlide = function(tabIndex,section){
                    configurableSlidesInOrder[tabIndex].map((item,index) => {
                        if(item[1]===section.name){
                            item[2] = section.enabled;  
                            item.push(section.label);
                        }
                    });
                };
            tmpSection = briefActions.getEventConfigItem(app.props.eventConfiguration.sections,'Programs')
            setConfigurableSlide(0,tmpSection);
            if(!tmpSection.enabled){
                lastSwipeList.tab1 = 2;
            }
            tmpSection = briefActions.getEventConfigItem(app.props.eventConfiguration.sections,'Sessions');
            setConfigurableSlide(0,tmpSection);
            if(!tmpSection.enabled && lastSwipeList.tab1 === 2)lastSwipeList.tab1 = 1;
            
            tmpSection = briefActions.getEventConfigItem(app.props.eventConfiguration.sections,'Hotels');
            setConfigurableSlide(1,tmpSection);
            if(!tmpSection.enabled)lastSwipeList.tab2 = 3;    
            tmpSection = briefActions.getEventConfigItem(app.props.eventConfiguration.sections,'Financials');
            setConfigurableSlide(1,tmpSection);
            if(!tmpSection.enabled && lastSwipeList.tab2 === 3)lastSwipeList.tab2 = 2;
            tmpSection = briefActions.getEventConfigItem(app.props.eventConfiguration.sections,'Invitations');
            setConfigurableSlide(1,tmpSection);
            if(!tmpSection.enabled && lastSwipeList.tab2 === 2)lastSwipeList.tab2 = 1;
            
            tmpSection = briefActions.getEventConfigItem(app.props.eventConfiguration.sections,'Email Campaign');
            setConfigurableSlide(2,tmpSection);
            if(!tmpSection.enabled)lastSwipeList.tab3 = 2;
            tmpSection = briefActions.getEventConfigItem(app.props.eventConfiguration.sections,'Survey');
            setConfigurableSlide(2,tmpSection);
            if(!tmpSection.enabled && lastSwipeList.tab3 === 2)lastSwipeList.tab3 = 1;
            tmpSection = briefActions.getEventConfigItem(app.props.eventConfiguration.sections,'Engagement');
            setConfigurableSlide(2,tmpSection);
            
            app.setState({lastSwipeList:lastSwipeList});
            app.setState({configurableSlidesInOrder:configurableSlidesInOrder});
            setTimeout(function(){app.setState({swipeListUpdated:true});},1000);
        };
        
        if(this.props.eventConfiguration !== prevProps.eventConfiguration) {
            if(this.props.eventConfiguration.sections)updateLastSwipeList(this);  
        }
        if(this.props.EngagementSurvey != prevProps.EngagementSurvey) {
            this.props.EngagementSurvey.map((item,index) => {
                this.props.dispatch(briefActions.getEngagementSurveyResults(item.id));   
            })
        }
        if(this.props.EngagementCampaigns != prevProps.EngagementCampaigns && this.props.EngagementCampaigns.length !== 0) {
            const {EngagementCampaigns} = this.props,
            startDate = new Date(EngagementCampaigns[0].deliveryDate).setHours(0,0,0,0),
            endDate = new Date(EngagementCampaigns[EngagementCampaigns.length - 1].deliveryDate).setHours(0,0,0,0);
        
            this.props.dispatch(briefActions.getCompanyRegistrationsByDateRange(this.state.id,[startDate,endDate]));   
        }
    } 

    handleSlideBSCarousel= (active,direction)=>{
      if(active === 2 && !this.state.companyRegistrationsRequested){
            this.props.dispatch(briefActions.getCompanyRegistrations(this.state.id));
            this.setState({companyRegistrationsRequested:true});
        }
    }
    

    render() {
        const { briefData } = this.props;
        const { loadingEventConfiguration } = this.props;
        const { eventConfiguration } = this.props;
        document.title = 'Ontrac Event';
        return (
            <div className="col-md-10 col-md-offset-1 event-page">
                {briefData && briefData.loading && <em>Loading Event...</em>}
                {briefData && !briefData.loading && this.state.tab === 1 &&
                    <div>
                        <LongText textStyle={{
                                marginTop: 0,
                                fontSize: '1.5em'
                            }} 
                            value={briefData.eventName} 
                            Container="h1"></LongText>
                        <Swipeable ref="slide-1"
                            onSwipedLeft={(e)=>this.onSwiped('LEFT',e)}
                            onSwipedRight={(e)=>this.onSwiped('RIGHT',e)}
                            trackMouse
                            style={{display: (this.state.tabSlide1 === 1 ? 'block': 'none')}}
                        >
                            <h2>Scorecard</h2>
                            {!loadingEventConfiguration && eventConfiguration
                                && <ExperienceScoreGraph></ExperienceScoreGraph>
                            }
                            <Carousel onSelect={this.handleSlideBSCarousel} interval={0}>
                                <Carousel.Item>
                                  <EventSummary></EventSummary>
                                </Carousel.Item>
                                <Carousel.Item>
                                  <ScorecardRegistration></ScorecardRegistration>
                                </Carousel.Item>
                                <Carousel.Item>
                                  <EventCompanyRegistrations></EventCompanyRegistrations>
                                </Carousel.Item>
                                <Carousel.Item>
                                  <EventROIRevenue></EventROIRevenue>
                                </Carousel.Item>
                                <Carousel.Item>
                                  <EventSocialMetrics></EventSocialMetrics>
                                </Carousel.Item>
                                <Carousel.Item>
                                  <EventStats></EventStats>
                                </Carousel.Item>
                            </Carousel>
                        </Swipeable>
                        <Swipeable
                            ref="slide-2"
                            onSwipedLeft={(e)=>this.onSwiped('LEFT',e)}
                            onSwipedRight={(e)=>this.onSwiped('RIGHT',e)}
                            trackMouse
                            style={{display: (this.state.tabSlide1 === 2 ? 'block': 'none')}}
                        >
                            {!loadingEventConfiguration && eventConfiguration
                                && <Sessions></Sessions>}
                        </Swipeable>
                        <Swipeable
                            ref="slide-3"
                            onSwipedLeft={(e)=>this.onSwiped('LEFT',e)}
                            onSwipedRight={(e)=>this.onSwiped('RIGHT',e)}
                            trackMouse
                            style={{display: (this.state.tabSlide1 === 3 ? 'block': 'none')}}
                        >
                            {!loadingEventConfiguration && eventConfiguration
                                && <Programs></Programs>}
                        </Swipeable>
                        {!loadingEventConfiguration && eventConfiguration
                            && <div style={{position: 'fixed', top: 100, right: 10}}>
                                <span
                                    className={this.state.swipeListUpdated ? 'temporary hide-it':'temporary'}
                                >
                                    Swipe left or right to view the next module or tap here to select a specific module&nbsp;
                                </span>
                                <button onClick={(e) => this.toggleSlideMenu()}
                                        style={{
                                            position: 'absolute',
                                            top:0,
                                            right:-5,
                                            opacity:.8,
                                            border: 'none',
                                            background: 'transparent',
                                            cursor:'pointer'
                                }}>
                                    <i className="fa fa-window-restore" aria-hidden="true"
                                    >
                                    </i>
                                </button>
                            </div>
                        }
                        <div style={{
                                display: (this.state.slideMenuOpened1 ? 'block': 'none'),
                                position: 'fixed',
                                top: 120,
                                right: 0,
                                background: 'rgba(0, 0, 0, .9)',
                                padding: 10,
                                borderRadius: 3,
                                width: '90%',
                            }}>
                            <ul className="event-swipe-menu">
                              <li><a onClick={(e) => this.switchSlides(e, 1)}>Scorecard</a></li>
                                {eventConfiguration
                                 && eventConfiguration.sections
                                 && this.isSectionEnabled(0,'Sessions')
                                 && <li><a onClick={(e) => this.switchSlides(e, 2)}>Sessions</a></li>}
                              {eventConfiguration
                                 && eventConfiguration.sections
                                 && this.isSectionEnabled(0,'Programs')
                                 && <li><a onClick={(e) => this.switchSlides(e, 3)}>Programs</a></li>}
                              </ul>
                        </div>
                    </div>
                }
                {briefData && !briefData.loading && this.state.tab === 2 && 
                    <div>
                        <h1 style={{
                                marginTop: 0,
                                fontSize: '1.5em',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {briefData.eventName}
                        </h1>
                        <Swipeable ref="slide-1"
                            onSwipedLeft={(e)=>this.onSwiped('LEFT',e)}
                            onSwipedRight={(e)=>this.onSwiped('RIGHT',e)}
                            trackMouse
                            style={{display: (this.state.tabSlide2 === 1 ? 'block': 'none')}}
                        >
                            <h2>Registration</h2>
                            <Carousel interval={0}>
                            <Carousel.Item>
                              <EventPacingGraph></EventPacingGraph>
                            </Carousel.Item>
                            <Carousel.Item>
                              <EventRegBreakdownGraph></EventRegBreakdownGraph>
                            </Carousel.Item>
                          </Carousel>
                        </Swipeable>
                        <Swipeable ref="slide-2"
                            onSwipedLeft={(e)=>this.onSwiped('LEFT',e)}
                            onSwipedRight={(e)=>this.onSwiped('RIGHT',e)}
                            trackMouse
                            style={{display: (this.state.tabSlide2 === 2 ? 'block': 'none')}}
                        >
                            <h2>{eventConfiguration
                                 && eventConfiguration.sections
                                 && this.getSectionLabel(1,'Invitations')}
                            </h2>
                            <Carousel interval={0}>
                                <Carousel.Item>
                                  <InvitationsGraph></InvitationsGraph>
                                </Carousel.Item>
                                <Carousel.Item>
                                  <InvitationsValueGraph></InvitationsValueGraph>
                                </Carousel.Item>
                              </Carousel>
                        </Swipeable>
                        <Swipeable ref="slide-3"
                            onSwipedLeft={(e)=>this.onSwiped('LEFT',e)}
                            onSwipedRight={(e)=>this.onSwiped('RIGHT',e)}
                            trackMouse
                            style={{display: (this.state.tabSlide2 === 3 ? 'block': 'none')}}
                        >
                             <h2>{eventConfiguration
                                 && eventConfiguration.sections
                                 && this.getSectionLabel(1,'Financials')}</h2>
                              <Carousel interval={0}>
                                <Carousel.Item>
                                  <RegistrationFeesGraph></RegistrationFeesGraph>
                                </Carousel.Item>
                                <Carousel.Item>
                                  <SponsorshipRevenueGraph></SponsorshipRevenueGraph>
                                </Carousel.Item>
                              </Carousel>
                        </Swipeable>
                        <Swipeable ref="slide-4"
                            onSwipedLeft={(e)=>this.onSwiped('LEFT',e)}
                            onSwipedRight={(e)=>this.onSwiped('RIGHT',e)}
                            trackMouse
                            style={{display: (this.state.tabSlide2 === 4 ? 'block': 'none')}}
                        >
                            <h2>{eventConfiguration
                                 && eventConfiguration.sections
                                 && this.getSectionLabel(1,'Hotel')}</h2>
                              <Carousel interval={0}>
                                <Carousel.Item>
                                  <HotelBlockGraph></HotelBlockGraph>
                                </Carousel.Item>
                                <Carousel.Item>
                                  <HotelPickup></HotelPickup>
                                </Carousel.Item>
                              </Carousel>
                        </Swipeable>
                        <div style={{position: 'fixed', top: 100, right: 10}}>
                            <button onClick={(e) => this.toggleSlideMenu()}
                                    style={{
                                        position: 'absolute',
                                        top:0,
                                        right:-5,
                                        opacity:.8,
                                        border: 'none',
                                        background: 'transparent',
                                        cursor:'pointer'
                            }}>
                                <i className="fa fa-window-restore" aria-hidden="true"
                                >
                                </i>
                            </button>
                        </div>
                        <div style={{
                                display: (this.state.slideMenuOpened2 ? 'block': 'none'),
                                position: 'fixed',
                                top: 120,
                                right: 0,
                                background: 'rgba(0, 0, 0, .9)',
                                padding: 10,
                                borderRadius: 3,
                                width: '90%',
                            }}>
                            <ul className="event-swipe-menu">
                               <li><a onClick={(e) => this.switchSlides(e, 1)}>Registration</a></li>
                                {eventConfiguration
                                 && eventConfiguration.sections
                                 && this.isSectionEnabled(1,'Invitations')
                                 && <li><a onClick={(e) => this.switchSlides(e, 2)}>{this.getSectionLabel(1,'Invitations')}</a></li>}
                                {eventConfiguration
                                 && eventConfiguration.sections
                                 && this.isSectionEnabled(1,'Financials')
                                 && <li><a onClick={(e) => this.switchSlides(e, 3)}>{this.getSectionLabel(1,'Financials')}</a></li>}
                                {eventConfiguration
                                 && eventConfiguration.sections
                                 && this.isSectionEnabled(1,'Hotels')
                                 && <li><a onClick={(e) => this.switchSlides(e, 4)}>{this.getSectionLabel(1,'Hotel')}</a></li>}
                            </ul>
                        </div>
                    </div>
                }
                {briefData && !briefData.loading && this.state.tab === 3 && 
                    <div>
                        <h1 style={{
                                marginTop: 0,
                                fontSize: '1.5em',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {briefData.eventName}
                        </h1>
                        <Swipeable ref="slide-1"
                            onSwipedLeft={(e)=>this.onSwiped('LEFT',e)}
                            onSwipedRight={(e)=>this.onSwiped('RIGHT',e)}
                            trackMouse
                            style={{display: (this.state.tabSlide3 === 1 ? 'block': 'none')}}
                        >
                            <h2>{eventConfiguration
                                 && eventConfiguration.sections
                                 && this.getSectionLabel(2,'Engagement')}</h2>
                             <label htmlFor="date-range-select">Select date range for Website Activity data</label>
                            <select onChange={this.onWebActivityDateRangeChange} className="form-control" id="date-range-select">
                              <option value="0">--select range--</option>
                              <option value="7-day">Last 7 days</option>
                              <option value="14-day">Last 14 days</option>
                              <option value="1-month">Last month</option>
                              <option value="3-month">Last 3 months</option>
                            </select>
                            <EngagementWebActivity></EngagementWebActivity>
                        </Swipeable>
                        <Swipeable ref="slide-2"
                            onSwipedLeft={(e)=>this.onSwiped('LEFT',e)}
                            onSwipedRight={(e)=>this.onSwiped('RIGHT',e)}
                            trackMouse
                            style={{display: (this.state.tabSlide3 === 2 ? 'block': 'none')}}
                        >
                            <h2>{eventConfiguration
                                 && eventConfiguration.sections
                                 && this.getSectionLabel(2,'Survey')}</h2>
                            <EngagementSurvey></EngagementSurvey>
                        </Swipeable>
                        <Swipeable ref="slide-3"
                            onSwipedLeft={(e)=>this.onSwiped('LEFT',e)}
                            onSwipedRight={(e)=>this.onSwiped('RIGHT',e)}
                            trackMouse
                            style={{display: (this.state.tabSlide3 === 3 ? 'block': 'none')}}
                        >
                            <h2>{eventConfiguration
                                 && eventConfiguration.sections
                                 && this.getSectionLabel(2,'Email Campaign')}</h2>
                            <EngagementCampaigns></EngagementCampaigns>
                        </Swipeable>
                        <div style={{position: 'fixed', top: 100, right: 10}}>
                            <button onClick={(e) => this.toggleSlideMenu()}
                                    style={{
                                        position: 'absolute',
                                        top:0,
                                        right:-5,
                                        opacity:.8,
                                        border: 'none',
                                        background: 'transparent',
                                        cursor:'pointer'
                            }}>
                                <i className="fa fa-window-restore" aria-hidden="true"
                                >
                                </i>
                            </button>
                        </div>
                        <div style={{
                                display: (this.state.slideMenuOpened3 ? 'block': 'none'),
                                position: 'fixed',
                                top: 120,
                                right: 0,
                                background: 'rgba(0, 0, 0, .9)',
                                padding: 10,
                                borderRadius: 3,
                                width: '90%',
                            }}>
                            <ul className="event-swipe-menu">
                               {eventConfiguration
                                 && eventConfiguration.sections
                                 && this.isSectionEnabled(2,'Engagement')
                                 && <li><a onClick={(e) => this.switchSlides(e, 1)}>Web Activity</a></li>}
                                {eventConfiguration
                                 && eventConfiguration.sections
                                 && this.isSectionEnabled(2,'Survey')
                                 && <li><a onClick={(e) => this.switchSlides(e, 2)}>Survey</a></li>}
                                {eventConfiguration
                                 && eventConfiguration.sections
                                 && this.isSectionEnabled(2,'Email Campaign')
                                 && <li><a onClick={(e) => this.switchSlides(e, 3)}>Email Campaigns</a></li>}
                            </ul>
                        </div>
                    </div>
                }
                {briefData && !briefData.loading && this.state.tab === 4 && 
                    <div>
                        <h1 style={{
                                marginTop: 0,
                                fontSize: '1.5em',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {briefData.eventName}
                        </h1>
                        <EventDetails></EventDetails>
                    </div>
                }
                <footer>
                    <div className={this.state.tab === 1 ? 'active' : null}>
                        <button onClick={(e) => this.setState({tab:1})}>
                            <i className="fa fa-tachometer" aria-hidden="true"></i>
                            <span>DASHBOARD</span>
                        </button>
                    </div>
                    <div className={this.state.tab === 2 ? 'active' : null}>
                        <button onClick={(e) => this.eventNowClicked()}>
                            <i className="fa fa-crosshairs" aria-hidden="true"></i>
                            <span>EVENT NOW</span>
                        </button>
                    </div>
                    {eventConfiguration
                        && eventConfiguration.sections
                        && (this.isSectionEnabled(2,'Engagement')
                        ||  this.isSectionEnabled(2,'Survey')
                        || this.isSectionEnabled(2,'Email Campaign'))
                    && <div className={this.state.tab === 3 ? 'active' : null}>
                        <button onClick={(e) => this.engagementClicked()}>
                            <i className="fa fa-handshake-o" aria-hidden="true"></i>
                            <span>ENGAGEMENT</span>
                        </button>
                    </div>}
                    <div className={this.state.tab === 4 ? 'active' : null}>
                        <button onClick={(e) => this.detailsClicked()}>
                            <i className="fa fa-info-circle" aria-hidden="true"></i>
                            <span>BRIEF</span>
                        </button>
                    </div>
                </footer>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const EngagementSurvey = state.briefs.EngagementSurvey;
    const EngagementCampaigns = state.briefs.EngagementCampaigns;
    const eventConfiguration = state.briefs.eventConfiguration !== undefined 
    && state.briefs.eventConfiguration.sections === undefined ? {
                    proprietary : null,
                    sections : [
                        {
                            name: 'Experience Scores',
                            enabled: true,
                            label: '',
                            importedFrom: ''
                        },
                        {
                            name: 'Invitations',
                            enabled: true,
                            label: '',
                            importedFrom: ''
                        },
                        {
                            name: 'Financials',
                            enabled: true,
                            label: '',
                            importedFrom: ''
                        },
                        {
                            name: 'Hotels',
                            enabled: true,
                            label: '',
                            importedFrom: ''
                        },
                        {
                            name: 'Sessions',
                            enabled: true,
                            label: '',
                            importedFrom: ''
                        },
                        {
                            name: 'Programs',
                            enabled: true,
                            label: '',
                            importedFrom: ''
                        },
                        {
                            name: 'Engagement',
                            enabled: true,
                            label: '',
                            importedFrom: ''
                        },
                        {
                            name: 'Survey',
                            enabled: true,
                            label: '',
                            importedFrom: ''
                        },
                        {
                            name: 'Campaign',
                            enabled: true,
                            label: '',
                            importedFrom: ''
                        }
                    ]}
          :state.briefs.eventConfiguration;
    const loadingEventConfiguration = state.briefs.loadingEventConfiguration;
    const briefData = (state.briefs.currentEvent !== undefined)?state.briefs.currentEvent:{loading: true};
    return {
        briefData,
        EngagementSurvey,
        EngagementCampaigns,
        eventConfiguration,
        loadingEventConfiguration
    };
}

const connectedEventPage = connect(mapStateToProps)(EventPage);
export { connectedEventPage as EventPage };
