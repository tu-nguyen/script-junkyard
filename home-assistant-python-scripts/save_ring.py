# yikes
current = str(datetime.datetime.now())
date, time = current.split()
year, month, day = date.split("-")
time, _ = time.split(".")
hr, min, sec = time.split(":")

# obtain ring doorbell camera object
# replace the camera.front_door by your camera entity
ring_cam = hass.states.get("camera.front_door")

subdir_name = f"{year}/{month}/{day}"

# get video URL
data = {
    "url": ring_cam.attributes.get("video_url"),
    "subdir": subdir_name,
    "filename": f"{year}-{month}-{day}-at-{hr}-{min}-{sec}_ring_front_door.mp4",
}

# call downloader integration to save the video
hass.services.call("downloader", "download_file", data)