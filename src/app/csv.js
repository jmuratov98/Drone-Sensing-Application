const obj_csv = {
    size: 0,
    data: []
}

function readImage(input) {
    if (input.files && input.files[0]) {
		let reader = new FileReader();
        reader.readAsBinaryString(input.files[0]);
		reader.onload = (e) => {
			obj_csv.size = e.total;
			obj_csv.data = e.target.result
            obj_csv.data = parseData(obj_csv.data);
            generateHeatMap(obj_csv.data);
		}
    }
}

function parseData(data){
    let csvData = [];
    let lbreak = data.split("\n");
    lbreak.forEach(res => {
        csvData.push(res.split(","));
    });
    csvData.shift();
    return csvData;
}