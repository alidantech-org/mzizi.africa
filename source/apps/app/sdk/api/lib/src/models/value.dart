import 'package:json_annotation/json_annotation.dart';
import 'coded_entity.dart';
import 'scheme.dart';

part 'value.g.dart';

/// A controlled classification member within one scheme, with optional supersession and an optional broader parent value in the same scheme. Wider, cross-scheme or many-parent links use value relations.
@JsonSerializable(includeIfNull: false)
class Value {
  const Value({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.label,
    this.parentId,
    required this.schemeId,
    this.supersedesId,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String label;
  final String? parentId;
  final String schemeId;
  final String? supersedesId;
  final DateTime updatedAt;
  final int version;

  factory Value.fromJson(Map<String, dynamic> json) => _$ValueFromJson(json);

  Map<String, dynamic> toJson() => _$ValueToJson(this);
}