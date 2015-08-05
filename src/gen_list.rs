use std::fs;
use std::path::Path;
use std::fs::File;
use std::io::Write;

pub fn gen_list() {
		//remove the list file if it's there
		fs::remove_file("www/js/list.csv");

		let mut f = File::create("www/js/list.csv").unwrap();

		for entry in fs::read_dir(&Path::new("data/")).unwrap() {

			let entry = entry.unwrap();
			if !fs::metadata(&entry.path()).unwrap().is_dir() {
				f.write_all(&entry.path().as_path().to_str().unwrap().as_bytes());
        f.write_all(b",");
			} 
		}
}
