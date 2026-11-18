import 'package:json_annotation/json_annotation.dart';

/// Reference Relation
enum LegalReferenceRelation {
  @JsonValue('amends')
  amends,
  @JsonValue('as-defined-in')
  asDefinedIn,
  @JsonValue('in-accordance-with')
  inAccordanceWith,
  @JsonValue('read-with')
  readWith,
  @JsonValue('refers-to')
  refersTo,
  @JsonValue('repeals')
  repeals,
  @JsonValue('subject-to')
  subjectTo,
  @JsonValue('under')
  under,
}
