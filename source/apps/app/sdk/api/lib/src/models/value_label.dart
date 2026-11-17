import 'package:json_annotation/json_annotation.dart';
import '../enums/value_label_kind.dart';
import 'validity_entity.dart';
import 'value.dart';

part 'value_label.g.dart';

/// A label of a value in one language and of one kind, so a value can be shown in English, Swahili and other languages, with alternative names, abbreviations and definitions. The value's own label is the default display text.
@JsonSerializable(includeIfNull: false)
class ValueLabel {
  const ValueLabel({
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.label,
    required this.labelKind,
    required this.languageTag,
    required this.updatedAt,
    this.validFrom,
    this.validUntil,
    required this.valueId,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String label;
  final ValueLabelKind labelKind;
  final String languageTag;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validUntil;
  final String valueId;
  final int version;

  factory ValueLabel.fromJson(Map<String, dynamic> json) => _$ValueLabelFromJson(json);

  Map<String, dynamic> toJson() => _$ValueLabelToJson(this);
}