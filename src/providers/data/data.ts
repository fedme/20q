import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { Device } from '@ionic-native/device';
import { Platform } from 'ionic-angular';
import { Stimuli } from '../stimuli/stimuli';
import { Api } from '../api/api';
import { AppInfo } from '../stimuli/app-info';

@Injectable()
export class Data {

  serverURI: string = "";
  recordsNumber: number;
  allRecords;

  constructor(
    private storage: Storage, 
    private filesystem: File,
    private device: Device,
    private platform: Platform,
    private api: Api,
    private stimuli: Stimuli
  ) {
      console.log('Hello Data Provider');
  }

  initialize() {
    this.allRecords = null;
    this.updateRecordsNumber();
  }

  serializeStimuliData() {
    let data = new Map();
    // parse queries
    let nStims = this.stimuli.stims.length;
    const queries = [];
    for (let qn=0; qn<this.stimuli.nQueries; qn++) {
      const stims = this.stimuli.stims.filter(stim => 
        stim.excluded && stim.queryNumber == qn + 1);
      stims.sort((a, b) => { return a.exclusionOrder - b.exclusionOrder});
      queries[qn] = {
        "type": stims[0].exclusionMode,
        "n_stims_pre": nStims,
        "n_exluded_stims": stims.length,
        "n_stims_post": nStims - stims.length,
        "excluded_stims": stims
      }
      nStims = nStims - stims.length;
    }
    data.set("n_queries", queries.length)
    data.set("queries", queries)
    return this.mapToObj(data);
  }

  save() {
    // Generate record ID
    console.log("[DEBUG] DB driver: " + this.storage.driver);
    const recordId = this.stimuli.participant.code + "_" + Date.now();

    // Create data object
    let dataObject = {
      "id": recordId,
      "participant": this.getParticipantInfo(),
      "app": this.getAppInfo(),
      "session": this.getSessionInfo(),
      "data": this.serializeStimuliData(),
      "platformInfo": this.getPlatformInfo()
    }
    console.log("[DEBUG] Serialized data: ", dataObject);

    // Save data
    if (this.stimuli.runInBrowser) this.postDataToServer(dataObject);
    else this.storage.set(recordId, dataObject);
  }

  getParticipantInfo() {
    return {
      "code": this.stimuli.participant.code,
      "age": this.stimuli.participant.age,
      "ageGroup": this.stimuli.participant.age,
      "grade": this.stimuli.participant.grade,
      "gender": this.stimuli.participant.gender
    }
  }

  getSessionInfo() {
    const now = new Date();
    const duration = Math.floor(Date.now() - this.stimuli.initialTimestamp);
    return {
      "datetime": now.toJSON(),
      "duration": duration
    }
  }

  getAppInfo() {
    return {
      "id": AppInfo.id,
      "version": AppInfo.version,
      "nameLabel": AppInfo.nameLabel,
      "lang": localStorage.getItem('lang')
    }
  }

  getPlatformInfo() {
    return {
      'platform': {
        'userAgent': this.platform.userAgent(),
        'platforms': this.platform.platforms(),
        'navigatorPlatform': this.platform.navigatorPlatform(),
        'height': this.platform.height(),
        'width': this.platform.width()
      },
      'device': {
        'uuid': this.device.uuid,
        'model': this.device.model,
        'cordovaVersion': this.device.cordova,
        'version': this.device.version,
        'manufacturer': this.device.manufacturer,
        'serial': this.device.serial
      }
    }
  }

  postDataToServer(dataObject: any) {
    const jsonData = JSON.stringify(dataObject);
    console.log("[saving data][browser][participant_code]", this.stimuli.participant.code);
    console.log("[saving data][browser][data]", dataObject);

    const requestBody = {
      participant_code: this.stimuli.participant.code,
      data: jsonData
    };

    this.api.post(this.serverURI, requestBody).subscribe(
      (resp) => {
        console.log("[saving data][browser][POST] resp", resp);
      },
      (err) => {
        console.log("[saving data][browser][POST] ERROR!!!", err);
      }
    );
  }

  loadAllRecords() {
    this.storageGetAll()
      .then(records => {
        console.log("[debug] storage.loadAllRecords()");
        this.allRecords = records;
        console.log(this.allRecords);
      });
  }

  exportRecordsAsJSON() {
    this.storageGetAll()
      .then(records => {
        console.log("records:");
        console.log(records);
        let fileContent = JSON.stringify(records);
        this.saveOutputFile(fileContent, "json");
      });
  }

  exportRecordsAsCsv() {
    this.storageGetAll()
      .then(records => {
        console.log("records:");
        console.log(records);
        let csvContent = this.fromRecordsToCsv(records);
        this.saveOutputFile(csvContent, "csv");
      });
  }

  updateRecordsNumber() {
    this.storageGetAll()
      .then(records => {
        if (records == null) return 0;
        this.recordsNumber = records.length;
      });
  }

  /**
   * Returns a Promise with the raw records from Storage
   */
  storageGetAll() {
    return this.storage.keys()
      .then(keys => Promise.all(keys.map(k => this.storage.get(k))));
  }


  fromRecordsToCsv(records) {
    console.log("[DEBUG] fromRecordsToCsv: ", records);
    let csvKeys = [];
    let csvRows = [];
    let first = true;
    for (let record of records) {
      if (first) {
        csvKeys = Object.keys(record).map(x => JSON.stringify(x));
        first = false;
      }
      let csvRow = Object.keys(record).map(key=>record[key]).map(x => JSON.stringify(x));
      csvRows.push(csvRow.join(","));
    }
    let csvContent = csvKeys.join(",") + "\n";
    csvContent += csvRows.join("\n");
    return csvContent;
  }


  saveOutputFile(csvContent, fileExt = "csv") {
    // build file name
    let currentdate = new Date();
    let day = ("0" + currentdate.getDate()).slice(-2);
    let month = ("0" + (currentdate.getMonth() + 1)).slice(-2);
    let filename = "data-" + day + month + currentdate.getFullYear() + "-"
      + currentdate.getHours() + currentdate.getMinutes() + "." + fileExt;

    // access file system
    this.filesystem.resolveDirectoryUrl(this.filesystem.externalDataDirectory)
      .then(directory => {
        // get or create results file
        this.filesystem.getFile(directory, filename, { create: true, exclusive: false })
          .then(file => {
            console.log("fileEntry is file?" + file.isFile.toString());
            this.writeFile(file, csvContent);
          })
          .catch(err => {
            console.log("Resolve file error: " + err);
          });
      })
      .catch(err => {
        console.log("Resolve filesystem error: " + err);
      });
  }

  writeFile(fileEntry, data) {
    fileEntry.createWriter(
      function (writer) {
        writer.onwriteend = function (evt) {
          console.log("File successfully created!");
        };
        writer.write(data);
      },
      function (evt, where) {
        console.log("Error writing file " + where + " :");
        console.log(JSON.stringify(evt));
      }
    );
  }

  mapToObj(strMap) {
    let obj = {};
    strMap.forEach((value, key, map) => {
      obj[key] = value;
    });
    return obj;
  }

}
