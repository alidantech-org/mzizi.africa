import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'reference_window.g.dart';

/// Reference Window
@JsonSerializable(includeIfNull: false)
class ReferenceReferenceWindow {
  const ReferenceReferenceWindow({this.limit, this.offset});
  final int? limit;
  final int? offset;

  factory ReferenceReferenceWindow.fromJson(Map<String, dynamic> json) => _$ReferenceReferenceWindowFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceReferenceWindowToJson(this);
}
