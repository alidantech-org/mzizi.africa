import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/reference/value_label_kind.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/validity_entity.dart';

part 'value_label.g.dart';

/// A label of a value in one language and of one kind, so a value can be shown in English, Swahili and other languages, with alternative names, abbreviations and definitions. The value's own label is the default display text.
@JsonSerializable(includeIfNull: false)
class ReferenceValueLabel {
  const ReferenceValueLabel({
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
  final ReferenceValueLabelKind labelKind;
  final String languageTag;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validUntil;
  final String valueId;
  final int version;

  factory ReferenceValueLabel.fromJson(Map<String, dynamic> json) => _$ReferenceValueLabelFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceValueLabelToJson(this);
}
