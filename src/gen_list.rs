extern crate rustc_serialize;

use std::fs;
use std::path::Path;
use std::fs::File;
use std::io::Write;
use std::io::Read;
use self::rustc_serialize::json::{Json, Parser};

pub fn gen_list() {
		//remove the list file if it's there
		fs::remove_file("www/js/list.csv");

		let mut f = File::create("www/js/list.csv").unwrap();

		for entry in fs::read_dir(&Path::new("data/")).unwrap() {
			let entry = entry.unwrap();
			if !fs::metadata(&entry.path()).unwrap().is_dir() {

				let mut file = File::open(&Path::new(&entry.path())).unwrap();
				let mut data = String::new();
				file.read_to_string(&mut data).unwrap();

				let json = Json::from_str(&data).unwrap();
				let obj = json.as_object().unwrap();
			
				let mut  name_desc = entry.path().as_path().to_str().unwrap().to_string();
					

				match obj.get("_comment") {
					Some(y) => { 
					//	println!("x: {}",format!("{}: {}", name_desc, y));
						name_desc = format!("{}: {}", name_desc, y);
					}
					None => {}
				} 



				f.write_all(&name_desc.as_bytes());
        f.write_all(b",");
			} 
		}
}
