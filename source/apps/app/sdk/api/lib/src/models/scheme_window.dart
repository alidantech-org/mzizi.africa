import 'package:json_annotation/json_annotation.dart';
import 'page_window.dart';

part 'scheme_window.g.dart';

/// Scheme Window
@JsonSerializable(includeIfNull: false)
class SchemeWindow {
  const SchemeWindow({
    this.code,
    this.limit,
    this.offset,
  });
  final String? code;
  final int? limit;
  final int? offset;

  factory SchemeWindow.fromJson(Map<String, dynamic> json) => _$SchemeWindowFromJson(json);

  Map<String, dynamic> toJson() => _$SchemeWindowToJson(this);
}