import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/scheme.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'value.g.dart';

/// A controlled classification member within one scheme, with optional supersession and an optional broader parent value in the same scheme. Wider, cross-scheme or many-parent links use value relations.
@JsonSerializable(includeIfNull: false)
class ReferenceValue {
  const ReferenceValue({
    required this.code,
    this.colorToken,
    required this.createdAt,
    this.deletedAt,
    this.iconCode,
    required this.id,
    required this.label,
    this.parentId,
    this.position,
    required this.schemeId,
    this.supersedesId,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String? colorToken;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? iconCode;
  final String id;
  final String label;
  final String? parentId;
  final int? position;
  final String schemeId;
  final String? supersedesId;
  final DateTime updatedAt;
  final int version;

  factory ReferenceValue.fromJson(Map<String, dynamic> json) => _$ReferenceValueFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceValueToJson(this);
}
