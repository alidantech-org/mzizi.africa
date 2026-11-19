import 'package:json_annotation/json_annotation.dart';

part 'legal_basis_items.g.dart';

/// Legal Basis Items
@JsonSerializable(includeIfNull: false)
class InsightsLegalBasisItems {
  const InsightsLegalBasisItems({
    required this.designation,
    required this.effect,
    required this.effectCode,
    required this.excerpt,
    required this.explanation,
    this.heading,
    required this.instrument,
    required this.instrumentCode,
    required this.provisionCode,
    required this.reviewStatus,
    this.via,
  });
  final String designation;
  final String effect;
  final String effectCode;
  final String excerpt;
  final String explanation;
  final String? heading;
  final String instrument;
  final String instrumentCode;
  final String provisionCode;
  final String reviewStatus;
  final String? via;

  factory InsightsLegalBasisItems.fromJson(Map<String, dynamic> json) => _$InsightsLegalBasisItemsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLegalBasisItemsToJson(this);
}
