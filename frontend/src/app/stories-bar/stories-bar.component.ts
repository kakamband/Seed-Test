import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {ApiService} from '../Services/api.service'

@Component({
  selector: 'app-stories-bar',
  templateUrl: './stories-bar.component.html',
  styleUrls: ['./stories-bar.component.css']
})
export class StoriesBarComponent implements OnInit {

  stories;
  selectedStory;
  selectedScenario;

  @Output()
  storyChosen: EventEmitter<any> = new EventEmitter();
  @Output()
  scenarioChosen: EventEmitter<any> = new EventEmitter();

  constructor(private apiService: ApiService) { 
    this.apiService.getStoriesEvent.subscribe(stories =>{
      this.stories = stories;
      console.log("stories-bar stories set");
    } );
  }

  ngOnInit() {
  }


  sortedStories(){
    if(this.stories){
      return this.stories.sort(function(a,b){ return a.issue_number - b.issue_number;});
    }
  }

  selectScenario(storyID, scenario) {
    this.selectedScenario = scenario;
    console.log("storyChosen emit");
    this.scenarioChosen.emit(scenario);
  
    console.log('selected scenario', this.selectedScenario);
    console.log('selected storyID', this.selectedStory)
  }

  addScenario(storyID) {
    this.apiService
      .addScenario(storyID)
      .subscribe(resp => {
        console.log('controller: stepDefinitions loaded', storyID);
        console.log('storyIDs same?', (storyID === this.selectedStory.story_id));
        this.stories[this.stories.indexOf(this.selectedStory)].scenarios.push(resp);
      });
  }


  selectStoryScenario(story){
    this.selectedStory = story;
    this.storyChosen.emit(story);
    var storyIndex = this.stories.indexOf(this.selectedStory);
    if(this.selectedScenario = this.stories[storyIndex].scenarios[0] !== undefined ){
      this.selectScenario(this.selectedStory.storyID,this.stories[storyIndex].scenarios[0])
    }
    console.log('selected storyID', this.selectedStory);
  }

}
