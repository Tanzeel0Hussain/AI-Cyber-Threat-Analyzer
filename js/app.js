(() => {

  const drop = document.getElementById('dropZone');
  const input = document.getElementById('fileInput');
  const analyze = document.getElementById('analyzeBtn');
  const reset = document.getElementById('resetBtn');

  let selected = null;


  // =========================================
  // SELECT FILE
  // =========================================

  const choose = (file) => {

    if (!file) return;

    selected = file;

    document.getElementById('fileName').textContent = file.name;

    document.getElementById('fileSize').textContent =
      FileHandler.size(file.size);

    document
      .getElementById('fileMeta')
      .classList.remove('hidden');

    analyze.disabled = false;
  };


  // =========================================
  // DROP ZONE CLICK
  // =========================================

  drop.addEventListener('click', (e) => {

    // Prevent file popup when clicking buttons,
    // label or input inside drop zone
    if (
      e.target.closest('button') ||
      e.target.closest('label') ||
      e.target.closest('input')
    ) {
      return;
    }

    input.click();

  });


  // =========================================
  // KEYBOARD SUPPORT
  // =========================================

  drop.addEventListener('keydown', (e) => {

    if (
      e.key === 'Enter' ||
      e.key === ' '
    ) {

      if (
        e.target.closest('button') ||
        e.target.closest('label') ||
        e.target.closest('input')
      ) {
        return;
      }

      e.preventDefault();

      input.click();
    }

  });


  // =========================================
  // FILE INPUT
  // =========================================

  input.addEventListener('change', () => {

    if (input.files && input.files[0]) {
      choose(input.files[0]);
    }

  });


  // =========================================
  // DRAG ENTER / DRAG OVER
  // =========================================

  ['dragenter', 'dragover'].forEach((eventName) => {

    drop.addEventListener(eventName, (e) => {

      e.preventDefault();

      drop.classList.add('dragover');

    });

  });


  // =========================================
  // DRAG LEAVE
  // =========================================

  drop.addEventListener('dragleave', (e) => {

    e.preventDefault();

    drop.classList.remove('dragover');

  });


  // =========================================
  // DROP FILE
  // =========================================

  drop.addEventListener('drop', (e) => {

    e.preventDefault();

    drop.classList.remove('dragover');

    const file = e.dataTransfer.files[0];

    if (file) {
      choose(file);
    }

  });


  // =========================================
  // ANALYZE BUTTON
  // =========================================

  analyze.addEventListener('click', async (e) => {

    // Stop click from reaching dropZone
    e.stopPropagation();

    if (!selected) {

      alert('Please select a log file first.');

      return;
    }

    try {

      analyze.disabled = true;

      analyze.textContent = 'Analyzing...';


      const text =
        await FileHandler.read(selected);


      const result =
        ThreatAnalyzer.analyze(text);


      Dashboard.render(result);


      // Scroll smoothly to result
      const resultPanel =
        document.getElementById('resultPanel');

      if (resultPanel) {

        resultPanel.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

      }

    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        'Unable to analyze the selected file.'
      );

    } finally {

      analyze.disabled = false;

      analyze.textContent =
        'Analyze Threats';

    }

  });


  // =========================================
  // RESET BUTTON
  // =========================================

  reset.addEventListener('click', (e) => {

    // Stop click from triggering file input
    e.stopPropagation();

    selected = null;

    input.value = '';


    document
      .getElementById('fileMeta')
      .classList.add('hidden');


    document.getElementById('fileName')
      .textContent = 'None';


    document.getElementById('fileSize')
      .textContent = '0 KB';


    analyze.disabled = true;


    Dashboard.clear();

  });

})();
