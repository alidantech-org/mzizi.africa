import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'child_window.g.dart';

/// Child Window
@JsonSerializable(includeIfNull: false)
class GeographyChildWindow {
  const GeographyChildWindow({this.hierarchyId, this.levelId, this.limit, this.offset, required this.parentId});
  final String? hierarchyId;
  final String? levelId;
  final int? limit;
  final int? offset;
  final String parentId;

  factory GeographyChildWindow.fromJson(Map<String, dynamic> json) => _$GeographyChildWindowFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyChildWindowToJson(this);
}
