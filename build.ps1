docker build -t learnup-ui  .
docker tag learnup-ui 158.255.74.102:5000/learnup-ui
docker push 158.255.74.102:5000/learnup-ui