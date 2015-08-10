extern crate iron;
extern crate staticfile;
extern crate mount;

// point your browser to http://127.0.0.1:3000/

use std::path::Path;

use iron::Iron;
use staticfile::Static;
use mount::Mount;
mod gen_list;

fn main() {

	gen_list::gen_list();
	let mut mount = Mount::new();

	mount.mount("/", Static::new(Path::new("www/")));
	mount.mount("/data/", Static::new(Path::new("data/")));

	println!("Doc server running on http://localhost:3000/");

	Iron::new(mount).http("0.0.0.0:3000").unwrap();
}
