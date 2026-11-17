import 'package:json_annotation/json_annotation.dart';

/// Dataset Assembly
enum SourceDatasetAssembly {
  @JsonValue('as-downloaded')
  asDownloaded,
  @JsonValue('assembled')
  assembled,
  @JsonValue('authored')
  authored,
}
