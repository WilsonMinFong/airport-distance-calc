import Map from './map';
import Util from './util';

class App {
  constructor() {
    this.map = Map.initialize();

    this.selectedAirports = {};
  }

  initialize() {
    this.bindAutocomplete();
    this.bindResetButton();
    this.bindInputClick();
  }

  updateDistance() {
    const { from, to } = this.selectedAirports;

    this.distance = Util.calculateNauticalDistance(from, to);

    $("#distance").html(
      `The distance between ${from.name} and ${to.name} is <strong>${Math.round(this.distance)} nautical miles</strong>.`
    );
  }

  updateLine() {
    this._removeLine();

    this.line = Map.addMapLine(this.map, this.selectedAirports);
  }

  bindAutocomplete() {
    $( "#fromAirport" ).autocomplete(this._autocompleteParams('from'));
    $( "#toAirport" ).autocomplete(this._autocompleteParams('to'));
  }

  bindResetButton() {
    $( "#reset" ).click(() => {
      this._resetInputFields();
      this._resetDistanceString();
      this._removeMarkers();
      this._removeLine();
      this.selectedAirports = {};
    });
  }

  bindInputClick() {
    $( "input" ).click((e) => {
      e.currentTarget.select();
    });
  }

  _autocompleteParams(dir) {
    return {
      source: (request, response) => {
        const query = request.term.toLowerCase();

        if (query) {
          const callback = (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              response(results.map((result) => {
                result.label = result.name;
                return result;
              }));
            }
          };

          Map.findAirports(this.map, query, callback);
        } else {
          response();
        }
      },
      minLength: 2,
      autoFocus: true,
      select: (event, ui) => {
        if (this.selectedAirports[dir]) {
          Map.removeMapMarker(this.selectedAirports[dir]);
        }

        this.selectedAirports[dir] = ui.item;
        this.selectedAirports[dir].marker = Map.addMapMarker(this.map, this.selectedAirports[dir]);

        const { from, to } = this.selectedAirports;

        debugger

        if (from && to) {
          this.updateDistance();
          this.updateLine();
        }

        Map.recenterMap(this.map, this.selectedAirports);
      }
    };
  }

  _resetInputFields() {
    $( "#fromAirport" ).val('');
    $( "#toAirport" ).val('');
  }

  _resetDistanceString() {
    $( "#distance" ).html('Enter the start and end endpoint to calculate the distance between the airports.');
  }

  _removeMarkers() {
    Object.keys(this.selectedAirports).forEach((key) => {
      const airport = this.selectedAirports[key];
      if (airport) {
        Map.removeMapMarker(airport);
      }
    });
  }

  _removeLine() {
    if (this.line) {
      Map.removeMapLine(this.line);
    }
  }
}

export default App;
