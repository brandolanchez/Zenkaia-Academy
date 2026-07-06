Get-ChildItem -Recurse "c:\Users\lanchez\Documents\Zenkai workout\public\images" |
  Where-Object { -not $_.PSIsContainer } |
  ForEach-Object {
    $sizeKB = [math]::Round($_.Length / 1KB, 1)
    Write-Output "$sizeKB KB - $($_.Name)"
  } |
  Sort-Object -Descending
