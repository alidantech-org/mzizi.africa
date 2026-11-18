import 'package:json_annotation/json_annotation.dart';

part 'legal_basis.g.dart';

/// Legal Basis
@JsonSerializable(includeIfNull: false)
class InsightsLegalBasis {
  const InsightsLegalBasis({required this.gaps, required this.items, required this.subject});
  final List<String> gaps;
  final List<Object?> items;
  final Object? subject;

  factory InsightsLegalBasis.fromJson(Map<String, dynamic> json) => _$InsightsLegalBasisFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLegalBasisToJson(this);
}
