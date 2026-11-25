import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'source_window.g.dart';

/// Source Window
@JsonSerializable(includeIfNull: false)
class SourceSourceWindow {
  const SourceSourceWindow({this.limit, this.offset});
  final int? limit;
  final int? offset;

  factory SourceSourceWindow.fromJson(Map<String, dynamic> json) => _$SourceSourceWindowFromJson(json);

  Map<String, dynamic> toJson() => _$SourceSourceWindowToJson(this);
}
